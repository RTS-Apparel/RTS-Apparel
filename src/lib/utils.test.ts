import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPKR,
  getEffectiveDiscountPercent,
  calculateDiscountedPrice,
  calculateOrderTotals,
  generateReferralCode,
  formatOrderNumber,
  isUrduText,
  slugify,
} from "./utils";

test("discount priority uses product discount first, then category discount", () => {
  assert.equal(
    getEffectiveDiscountPercent({ discount_percent: 20 }, { discount_percent: 10 }),
    20
  );
  assert.equal(
    getEffectiveDiscountPercent({ discount_percent: 0 }, { discount_percent: 15 }),
    15
  );
  assert.equal(
    getEffectiveDiscountPercent({ discount_percent: 0 }, { discount_percent: 0 }),
    0
  );
});

test("calculateDiscountedPrice computes accurate PKR price", () => {
  assert.equal(calculateDiscountedPrice(3200, 20), 2560);
  assert.equal(calculateDiscountedPrice(5000, 0), 5000);
});

test("calculateOrderTotals computes subtotal, discount amount, and delivery charge", () => {
  const totals = calculateOrderTotals(
    [
      { price: 5000, discountPercent: 20, quantity: 2 }, // orig 10000, disc 8000
      { price: 3000, discountPercent: 0, quantity: 1 }, // orig 3000, disc 3000
    ],
    250
  );
  assert.equal(totals.originalSubtotal, 13000);
  assert.equal(totals.subtotal, 11000);
  assert.equal(totals.discountAmount, 2000);
  assert.equal(totals.deliveryCharge, 250);
  assert.equal(totals.totalAmount, 11250);
});

test("generateReferralCode and formatOrderNumber follow RTS conventions", () => {
  assert.equal(generateReferralCode("Ali Raza", "123"), "RTS-ALIR123");
  assert.equal(formatOrderNumber(42, 2026), "RTS-2026-0042");
});

test("formatPKR, isUrduText, and slugify work accurately", () => {
  assert.equal(formatPKR(4500), "Rs. 4,500");
  assert.equal(isUrduText("کرتہ شلوار"), true);
  assert.equal(isUrduText("Kurta Shalwar"), false);
  assert.equal(slugify("Kurta Shalwar Collection"), "kurta-shalwar-collection");
});
