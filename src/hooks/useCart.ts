import { useCartStore } from "../store/cartStore";
import { useDataStore } from "../store/dataStore";
import {
  calculateOrderTotals,
  getEffectiveDiscountPercent,
} from "../lib/utils";

export function useCart(selectedCity?: string) {
  const cart = useCartStore();
  const categories = useDataStore((s) => s.categories);
  const products = useDataStore((s) => s.products);
  const deliveryRates = useDataStore((s) => s.deliveryRates);

  const enrichedItems = cart.items.map((item) => {
    const latestProduct =
      products.find((p) => p.id === item.product_id) || item.product;
    const category = categories.find((c) => c.id === latestProduct.category_id);
    const effectiveDiscount = getEffectiveDiscountPercent(
      latestProduct,
      category
    );
    return {
      ...item,
      product: latestProduct,
      category,
      effectiveDiscount,
    };
  });

  const cityToUse = selectedCity || cart.selectedCity;
  const deliveryRateObj = cityToUse
    ? deliveryRates.find(
        (r) => r.city_name.toLowerCase() === cityToUse.toLowerCase()
      )
    : undefined;

  const baseTotals = calculateOrderTotals(
    enrichedItems.map((i) => ({
      price: i.product.price,
      discountPercent: i.effectiveDiscount,
      quantity: i.quantity,
    })),
    deliveryRateObj ? deliveryRateObj.charge : 0
  );

  const totalCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    ...cart,
    enrichedItems,
    totalCount,
    totals: {
      ...baseTotals,
      itemCount: totalCount,
    },
  };
}
