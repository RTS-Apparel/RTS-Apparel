export function formatPKR(amount: number): string {
  const rounded = Math.round(Number(amount) || 0);
  return `Rs. ${rounded.toLocaleString("en-US")}`;
}

/**
 * Discount priority logic from 05_Backend_Schema.md Section 3:
 * 1. If product has discount_percent > 0 -> use product discount
 * 2. Else if category has active discount_percent > 0 -> use category discount
 * 3. Else -> 0
 */
export function getEffectiveDiscountPercent(
  product: { discount_percent?: number | null },
  category?: { discount_percent?: number | null } | null
): number {
  const prodDisc = Number(product.discount_percent || 0);
  if (prodDisc > 0) {
    return Math.min(Math.max(prodDisc, 0), 95);
  }
  const catDisc = Number(category?.discount_percent || 0);
  if (catDisc > 0) {
    return Math.min(Math.max(catDisc, 0), 95);
  }
  return 0;
}

export function calculateDiscountedPrice(
  price: number,
  discountPercent: number
): number {
  const validPrice = Math.max(0, Number(price) || 0);
  const validDiscount = Math.min(Math.max(Number(discountPercent) || 0, 0), 95);
  if (validDiscount <= 0) return Math.round(validPrice);
  return Math.round(validPrice * (1 - validDiscount / 100));
}

export interface OrderCalculationInputItem {
  price: number;
  discountPercent: number;
  quantity: number;
}

export interface OrderTotalsSummary {
  originalSubtotal: number;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
}

export function calculateOrderTotals(
  items: OrderCalculationInputItem[],
  deliveryCharge: number
): OrderTotalsSummary {
  let originalSubtotal = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const origUnit = Math.round(Math.max(0, item.price || 0));
    const discUnit = calculateDiscountedPrice(origUnit, item.discountPercent || 0);
    originalSubtotal += origUnit * qty;
    subtotal += discUnit * qty;
  }

  const discountAmount = Math.max(0, originalSubtotal - subtotal);
  const cleanDelivery = Math.max(0, Math.round(deliveryCharge || 0));
  const totalAmount = subtotal + cleanDelivery;

  return {
    originalSubtotal,
    subtotal,
    discountAmount,
    deliveryCharge: cleanDelivery,
    totalAmount,
  };
}

export function generateReferralCode(
  fullName: string,
  suffixDigits?: string
): string {
  const cleanedName = (fullName || "AGENT")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 4);
  const prefix = cleanedName.length >= 3 ? cleanedName : cleanedName.padEnd(3, "X");
  const digits =
    suffixDigits && /^\d{3}$/.test(suffixDigits)
      ? suffixDigits
      : String(Math.floor(100 + Math.random() * 900));
  return `RTS-${prefix}${digits}`;
}

export function formatOrderNumber(
  sequenceNumber: number,
  year = new Date().getFullYear()
): string {
  const padded = String(Math.max(1, Math.floor(sequenceNumber))).padStart(4, "0");
  return `RTS-${year}-${padded}`;
}

export function isUrduText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || "");
}

export function slugify(text: string): string {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
