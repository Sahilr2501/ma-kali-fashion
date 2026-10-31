import nodemailer from "nodemailer";
import { PAYMENT_LABELS, STORE_NAME, storeContact } from "./constants";
import { escapeHtml, formatDateTimeIST, formatINR } from "./format";
import type { OrderEmailData } from "./types";

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM &&
      process.env.ADMIN_EMAIL,
  );
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function itemRows(order: OrderEmailData) {
  return order.items
    .map((item) => {
      const extras = [item.size, item.color].filter(Boolean).join(" / ");
      return `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eadfce;">
          ${escapeHtml(item.name)}${extras ? `<br/><span style="color:#6b6258;font-size:12px;">${escapeHtml(extras)}</span>` : ""}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #eadfce;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eadfce;text-align:right;">${escapeHtml(formatINR(item.unitPrice))}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eadfce;text-align:right;">${escapeHtml(formatINR(item.subtotal))}</td>
      </tr>`;
    })
    .join("");
}

function brandedShell(title: string, body: string) {
  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;background:#F7F0E6;font-family:Georgia,serif;color:#292524;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F0E6;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border:1px solid #eadfce;">
              <tr>
                <td style="background:#551C28;color:#F7F0E6;padding:22px 28px;">
                  <div style="font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#C6A15B;">${escapeHtml(STORE_NAME)}</div>
                  <h1 style="margin:8px 0 0;font-size:26px;">${escapeHtml(title)}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">${body}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function customerHtml(order: OrderEmailData) {
  const contact = storeContact();
  return brandedShell(
    "Order confirmation",
    `
      <p>Dear ${escapeHtml(order.customerName)},</p>
      <p>Thank you for shopping with ${escapeHtml(STORE_NAME)}. We have received your order request. This message confirms the details you submitted. Payment remains pending until the store verifies it.</p>
      <p><strong>Order reference:</strong> ${escapeHtml(order.orderReference)}</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:18px 0;">
        <thead>
          <tr style="background:#F7F0E6;">
            <th align="left" style="padding:10px 8px;">Item</th>
            <th style="padding:10px 8px;">Qty</th>
            <th align="right" style="padding:10px 8px;">Price</th>
            <th align="right" style="padding:10px 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows(order)}</tbody>
      </table>
      <p>Delivery charges: ${escapeHtml(formatINR(order.deliveryCharge))}<br/>
      <strong>Final total: ${escapeHtml(formatINR(order.total))}</strong></p>
      <p><strong>Delivery address</strong><br/>
      ${escapeHtml(order.address)}<br/>
      ${escapeHtml(order.city)}, ${escapeHtml(order.state)} ${escapeHtml(order.pinCode)}</p>
      <p><strong>Payment method:</strong> ${escapeHtml(PAYMENT_LABELS[order.paymentMethod])}<br/>
      <strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</p>
      <p>If you do not hear from us or did not expect this email, please contact the store with your order reference.</p>
      <p>Store contact<br/>
      ${contact.phone ? escapeHtml(contact.phone) : ""}<br/>
      ${contact.email ? escapeHtml(contact.email) : ""}<br/>
      ${contact.address ? escapeHtml(contact.address) : ""}</p>
    `,
  );
}

function adminHtml(order: OrderEmailData) {
  return brandedShell(
    "New customer order",
    `
      <p>A customer submitted a new order. This email is the primary order record. Please retain it.</p>
      <p><strong>Order reference:</strong> ${escapeHtml(order.orderReference)}<br/>
      <strong>Date and time:</strong> ${escapeHtml(formatDateTimeIST(order.orderedAt))}</p>
      <p><strong>Customer</strong><br/>
      ${escapeHtml(order.customerName)}<br/>
      ${escapeHtml(order.email)}<br/>
      ${escapeHtml(order.phone)}</p>
      <p><strong>Delivery address</strong><br/>
      ${escapeHtml(order.address)}<br/>
      ${escapeHtml(order.city)}, ${escapeHtml(order.state)} ${escapeHtml(order.pinCode)}</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:18px 0;">
        <thead>
          <tr style="background:#F7F0E6;">
            <th align="left" style="padding:10px 8px;">Item</th>
            <th style="padding:10px 8px;">Qty</th>
            <th align="right" style="padding:10px 8px;">Price</th>
            <th align="right" style="padding:10px 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows(order)}</tbody>
      </table>
      <p>Delivery charges: ${escapeHtml(formatINR(order.deliveryCharge))}<br/>
      <strong>Final total: ${escapeHtml(formatINR(order.total))}</strong></p>
      <p><strong>Payment method:</strong> ${escapeHtml(PAYMENT_LABELS[order.paymentMethod])}<br/>
      <strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</p>
      ${order.notes ? `<p><strong>Customer notes:</strong><br/>${escapeHtml(order.notes)}</p>` : "<p>No customer notes were provided.</p>"}
    `,
  );
}

async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!smtpConfigured()) {
    console.error("Email delivery failed: SMTP is not fully configured.");
    return { accepted: false };
  }

  try {
    const info = await transporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    const accepted = Array.isArray(info.accepted) && info.accepted.length > 0;
    if (!accepted) {
      console.error("Email delivery failed: SMTP did not accept the message.");
    }
    return { accepted };
  } catch {
    console.error("Email delivery failed: the mail provider rejected the request.");
    return { accepted: false };
  }
}

export async function sendOrderEmails(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const [customer, admin] = await Promise.all([
    sendMail({
      to: order.email,
      subject: `Your Order Confirmation – ${STORE_NAME}`,
      html: customerHtml(order),
    }),
    sendMail({
      to: adminEmail,
      subject: `New Customer Order – ${STORE_NAME}`,
      html: adminHtml(order),
    }),
  ]);

  return {
    customerEmailSent: customer.accepted,
    adminEmailSent: admin.accepted,
  };
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  return sendMail({
    to: adminEmail,
    subject: `Website enquiry – ${STORE_NAME}`,
    html: brandedShell(
      "Website enquiry",
      `<p><strong>Name:</strong> ${escapeHtml(input.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(input.email)}<br/>
      <strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
      <p>${escapeHtml(input.message)}</p>`,
    ),
  });
}
