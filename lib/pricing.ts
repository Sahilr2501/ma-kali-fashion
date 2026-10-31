export const DELIVERY_FEE = 99;
export const FREE_DELIVERY_THRESHOLD = 1999;

export function deliveryChargeFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function orderTotals(subtotal: number) {
  const deliveryCharge = deliveryChargeFor(subtotal);
  return {
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
  };
}
