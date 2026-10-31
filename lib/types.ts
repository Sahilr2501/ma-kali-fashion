import type { PaymentMethod } from "./constants";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: PublicCategory | null;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  sizes: string[];
  colors: string[];
  inStock: boolean;
};

export type CartItemInput = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type CheckoutPayload = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: CartItemInput[];
};

export type ValidatedOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  size?: string;
  color?: string;
};

export type OrderEmailData = {
  orderReference: string;
  orderedAt: Date;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "Pending confirmation";
  notes: string;
  items: ValidatedOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
};
