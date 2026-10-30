import { useDataStore } from "../store/dataStore";
import {
  calculateDiscountedPrice,
  getEffectiveDiscountPercent,
} from "../lib/utils";
import { Product } from "../types";

export function useProducts() {
  const products = useDataStore((s) => s.products);
  const categories = useDataStore((s) => s.categories);
  const banners = useDataStore((s) => s.banners);

  const getEffectiveDiscount = (product: Product): number => {
    const category = categories.find((c) => c.id === product.category_id);
    return getEffectiveDiscountPercent(product, category);
  };

  const productsWithMeta = products.map((product) => {
    const category = categories.find((c) => c.id === product.category_id);
    const effectiveDiscount = getEffectiveDiscountPercent(product, category);
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      effectiveDiscount
    );
    return {
      ...product,
      categories: category,
      effectiveDiscount,
      discountedPrice,
    };
  });

  const activeProducts = productsWithMeta.filter((p) => p.is_active);
  const featuredProducts = activeProducts.filter((p) => p.is_featured);
  const newArrivals = [...activeProducts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const saleProducts = activeProducts.filter((p) => p.effectiveDiscount > 0);
  const activeBanners = [...banners]
    .filter((b) => b.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return {
    products: productsWithMeta,
    activeProducts,
    featuredProducts,
    newArrivals,
    saleProducts,
    discountedProducts: saleProducts,
    activeBanners,
    getEffectiveDiscount,
    categories: [...categories].sort(
      (a, b) => a.display_order - b.display_order
    ),
  };
}
