import mongoose from "mongoose";
import {
  MAX_ITEM_QUANTITY,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "./constants";
import type { CartItemInput, CheckoutPayload } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PIN_PATTERN = /^[1-9][0-9]{5}$/;

export type FieldErrors = Record<string, string>;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value);
}

export function validateCheckout(input: unknown): {
  data?: CheckoutPayload;
  errors: FieldErrors;
} {
  const errors: FieldErrors = {};
  if (!input || typeof input !== "object") {
    return { errors: { form: "Checkout details are required." } };
  }

  const body = input as Record<string, unknown>;
  const customerName = clean(body.customerName);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone).replace(/\s+/g, "");
  const address = clean(body.address);
  const city = clean(body.city);
  const state = clean(body.state);
  const pinCode = clean(body.pinCode);
  const notes = clean(body.notes);
  const paymentMethod = clean(body.paymentMethod) as PaymentMethod;

  if (customerName.length < 2) errors.customerName = "Please enter your full name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
  if (!PHONE_PATTERN.test(phone)) errors.phone = "Enter a 10-digit Indian mobile number.";
  if (address.length < 8) errors.address = "Please enter a complete delivery address.";
  if (city.length < 2) errors.city = "City is required.";
  if (state.length < 2) errors.state = "State is required.";
  if (!PIN_PATTERN.test(pinCode)) errors.pinCode = "Enter a valid 6-digit PIN code.";
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    errors.paymentMethod = "Please choose a payment method.";
  }
  if (notes.length > 500) errors.notes = "Order notes must be 500 characters or fewer.";

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    errors.items = "Your cart is empty.";
  }

  const items: CartItemInput[] = [];
  rawItems.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.items = "Cart items are invalid.";
      return;
    }
    const row = item as Record<string, unknown>;
    const productId = clean(row.productId);
    const quantity = Number(row.quantity);
    const size = clean(row.size) || undefined;
    const color = clean(row.color) || undefined;
    if (!isObjectId(productId)) {
      errors.items = "One or more products are invalid.";
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      errors.items = `Quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`;
      return;
    }
    items.push({ productId, quantity, size, color });
    void index;
  });

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      paymentMethod,
      notes: notes || undefined,
      items,
    },
    errors,
  };
}

export type ProductInput = {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  stock?: number;
  sizes?: string[];
  colors?: string[];
  isActive?: boolean;
};

export type CategoryInput = {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export function validateProductInput(
  input: unknown,
  partial = false,
): { data?: ProductInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  if (!input || typeof input !== "object") {
    return { errors: { form: "Product details are required." } };
  }
  const body = input as Record<string, unknown>;

  const name = body.name !== undefined ? clean(body.name) : undefined;
  const description = body.description !== undefined ? clean(body.description) : undefined;
  const categoryId = body.categoryId !== undefined ? clean(body.categoryId) : undefined;
  const price = body.price !== undefined ? Number(body.price) : undefined;
  const originalPrice =
    body.originalPrice === "" || body.originalPrice === null || body.originalPrice === undefined
      ? undefined
      : Number(body.originalPrice);
  const stock = body.stock !== undefined ? Number(body.stock) : undefined;
  const images = Array.isArray(body.images)
    ? body.images.map((value) => clean(value)).filter(Boolean)
    : undefined;
  const sizes = Array.isArray(body.sizes)
    ? body.sizes.map((value) => clean(value)).filter(Boolean)
    : undefined;
  const colors = Array.isArray(body.colors)
    ? body.colors.map((value) => clean(value)).filter(Boolean)
    : undefined;
  const isActive = body.isActive !== undefined ? Boolean(body.isActive) : undefined;
  const slug = body.slug !== undefined ? clean(body.slug) : undefined;

  if (!partial || name !== undefined) {
    if (!name || name.length < 2) errors.name = "Product name is required.";
  }
  if (!partial || description !== undefined) {
    if (!description || description.length < 8) errors.description = "Please add a product description.";
  }
  if (!partial || categoryId !== undefined) {
    if (!categoryId || !isObjectId(categoryId)) errors.categoryId = "Choose a valid category.";
  }
  if (!partial || price !== undefined) {
    if (price === undefined || Number.isNaN(price) || price < 0) errors.price = "Enter a valid selling price.";
  }
  if (originalPrice !== undefined && (Number.isNaN(originalPrice) || originalPrice < 0)) {
    errors.originalPrice = "Original price must be a valid amount.";
  }
  if (!partial || stock !== undefined) {
    if (stock === undefined || !Number.isInteger(stock) || stock < 0) {
      errors.stock = "Stock must be a whole number of 0 or more.";
    }
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      name,
      slug,
      description,
      categoryId,
      price,
      originalPrice,
      images,
      stock,
      sizes,
      colors,
      isActive,
    },
    errors,
  };
}

export function validateCategoryInput(
  input: unknown,
  partial = false,
): { data?: CategoryInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  if (!input || typeof input !== "object") {
    return { errors: { form: "Category details are required." } };
  }
  const body = input as Record<string, unknown>;
  const name = body.name !== undefined ? clean(body.name) : undefined;
  const description = body.description !== undefined ? clean(body.description) : undefined;
  const image = body.image !== undefined ? clean(body.image) : undefined;
  const isActive = body.isActive !== undefined ? Boolean(body.isActive) : undefined;
  const slug = body.slug !== undefined ? clean(body.slug) : undefined;

  if (!partial || name !== undefined) {
    if (!name || name.length < 2) errors.name = "Category name is required.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: { name, slug, description, image, isActive },
    errors,
  };
}
