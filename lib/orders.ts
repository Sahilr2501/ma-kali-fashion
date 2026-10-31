import { randomUUID } from "crypto";
import { connectDB } from "./mongodb";
import { Product } from "@/models/Product";
import { MAX_ITEM_QUANTITY } from "./constants";
import { orderTotals } from "./pricing";
import type { CartItemInput, OrderEmailData, ValidatedOrderItem } from "./types";
import type { PaymentMethod } from "./constants";

export function generateOrderReference(now = new Date()) {
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const unique = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `MKFA-${stamp}-${unique}`;
}

export async function validateCartAgainstCatalogue(items: CartItemInput[]) {
  await connectDB();
  const ids = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((product) => [String(product._id), product]));

  const errors: string[] = [];
  const validated: ValidatedOrderItem[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product || !product.isActive) {
      errors.push("One or more products are unavailable.");
      continue;
    }
    if (product.stock < item.quantity) {
      errors.push(`${product.name} does not have enough stock.`);
      continue;
    }
    if (item.quantity > MAX_ITEM_QUANTITY) {
      errors.push(`Quantity for ${product.name} is too high.`);
      continue;
    }
    if (product.sizes?.length && (!item.size || !product.sizes.includes(item.size))) {
      errors.push(`Please choose a valid size for ${product.name}.`);
      continue;
    }
    if (product.colors?.length && (!item.color || !product.colors.includes(item.color))) {
      errors.push(`Please choose a valid colour for ${product.name}.`);
      continue;
    }

    validated.push({
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: product.price * item.quantity,
      size: item.size,
      color: item.color,
    });
  }

  if (errors.length > 0) {
    return { errors };
  }

  const subtotal = validated.reduce((sum, item) => sum + item.subtotal, 0);
  return {
    items: validated,
    totals: orderTotals(subtotal),
    errors: [],
  };
}

export function buildOrderEmailData(input: {
  orderReference: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: ValidatedOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}): OrderEmailData {
  return {
    orderReference: input.orderReference,
    orderedAt: new Date(),
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    pinCode: input.pinCode,
    paymentMethod: input.paymentMethod,
    paymentStatus: "Pending confirmation",
    notes: input.notes || "",
    items: input.items,
    subtotal: input.subtotal,
    deliveryCharge: input.deliveryCharge,
    total: input.total,
  };
}
