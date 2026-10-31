import { createHash } from "crypto";
import { CHECKOUT_RATE_LIMIT, CHECKOUT_RATE_WINDOW_MS, storeContact } from "@/lib/constants";
import { sendOrderEmails } from "@/lib/email";
import { buildOrderEmailData, generateOrderReference, validateCartAgainstCatalogue } from "@/lib/orders";
import { isDatabaseConfigured } from "@/lib/mongodb";
import { findRecentCheckout, rateLimit, rememberCheckout } from "@/lib/rate-limit";
import { clientKey, isSameOrigin, jsonError, jsonOk } from "@/lib/request";
import { validateCheckout } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("This request is not allowed.", 403);
  }
  if (!isDatabaseConfigured()) {
    return jsonError("The store catalogue is not available yet.", 503);
  }
  if (!rateLimit(`checkout:${clientKey(request)}`, CHECKOUT_RATE_LIMIT, CHECKOUT_RATE_WINDOW_MS)) {
    return jsonError("Too many checkout attempts. Please wait and try again.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Checkout details could not be read.", 400);
  }

  const parsed = validateCheckout(body);
  if (!parsed.data) {
    return jsonError("Please correct the highlighted fields.", 400, { errors: parsed.errors });
  }

  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        email: parsed.data.email,
        phone: parsed.data.phone,
        items: parsed.data.items,
      }),
    )
    .digest("hex");

  const recent = findRecentCheckout(fingerprint);
  if (recent) {
    return jsonError(
      "This checkout was already submitted a moment ago. If you did not receive confirmation, contact the store with your details.",
      409,
      { orderReference: recent.orderReference },
    );
  }

  const catalogue = await validateCartAgainstCatalogue(parsed.data.items);
  if (!catalogue.items || catalogue.errors.length > 0) {
    return jsonError(catalogue.errors[0] || "The cart could not be validated.", 409, {
      errors: { items: catalogue.errors[0] },
    });
  }

  const orderReference = generateOrderReference();
  const order = buildOrderEmailData({
    orderReference,
    customerName: parsed.data.customerName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: parsed.data.city,
    state: parsed.data.state,
    pinCode: parsed.data.pinCode,
    paymentMethod: parsed.data.paymentMethod,
    notes: parsed.data.notes,
    items: catalogue.items,
    subtotal: catalogue.totals.subtotal,
    deliveryCharge: catalogue.totals.deliveryCharge,
    total: catalogue.totals.total,
  });

  const delivery = await sendOrderEmails(order);
  rememberCheckout(fingerprint, orderReference);

  const contact = storeContact();
  const responseBody = {
    orderReference,
    customerEmailSent: delivery.customerEmailSent,
    adminEmailSent: delivery.adminEmailSent,
    totals: catalogue.totals,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: order.paymentStatus,
    upiId: parsed.data.paymentMethod === "upi" ? contact.upiId : "",
    items: catalogue.items,
  };

  if (delivery.customerEmailSent && delivery.adminEmailSent) {
    return jsonOk({
      ...responseBody,
      status: "both_ok",
      message: "Your order request has been submitted.",
    });
  }

  if (!delivery.customerEmailSent && delivery.adminEmailSent) {
    return Response.json(
      {
        ok: false,
        status: "customer_failed_admin_ok",
        message:
          "The store has received your order, but a confirmation email could not be sent. Please keep your order reference and contact the store if you need a copy.",
        ...responseBody,
      },
      { status: 207 },
    );
  }

  if (delivery.customerEmailSent && !delivery.adminEmailSent) {
    return jsonError(
      "Your request could not be fully confirmed with the store. Please contact the store immediately with your order reference and details. Do not assume the order is complete.",
      503,
      { status: "customer_ok_admin_failed", ...responseBody },
    );
  }

  return jsonError(
    "Your order could not be confirmed by email. Please contact the store with your details. The order was not saved.",
    503,
    { status: "both_failed", ...responseBody },
  );
}
