export const STORE_NAME = "MA Kali Fashion & Accessories";
export const STORE_SHORT_NAME = "MA Kali";

export const PAYMENT_METHODS = ["cod", "upi"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  upi: "Manual UPI payment",
};

export const MAX_ITEM_QUANTITY = 20;
export const CHECKOUT_RATE_LIMIT = 5;
export const CHECKOUT_RATE_WINDOW_MS = 15 * 60 * 1000;

export function storeContact() {
  return {
    phone: process.env.NEXT_PUBLIC_STORE_PHONE || "Contact the store for phone details",
    email: process.env.NEXT_PUBLIC_STORE_EMAIL || process.env.ADMIN_EMAIL || "",
    address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "",
    upiId: process.env.NEXT_PUBLIC_UPI_ID || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
