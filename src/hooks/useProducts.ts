import { useEffect } from "react";
import { useDataStore } from "../store/dataStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  calculateDiscountedPrice,
  getEffectiveDiscountPercent,
} from "../lib/utils";
import { Product, SiteSettings } from "../types";

let storefrontLoadStarted = false;

async function loadStorefrontData() {
  if (!isSupabaseConfigured || storefrontLoadStarted) return;
  storefrontLoadStarted = true;

  const [categoryResult, productResult, bannerResult, rateResult, settingsResult] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("banners").select("*").eq("is_active", true).order("display_order"),
    supabase.from("city_delivery_rates").select("*").eq("is_active", true).order("city_name"),
    supabase.from("site_settings").select("key,value"),
  ]);

  if (categoryResult.error) {
    console.error("Unable to load storefront categories:", categoryResult.error.message);
  } else {
    useDataStore.setState({ categories: categoryResult.data || [] });
  }

  if (productResult.error) {
    console.error("Unable to load storefront products:", productResult.error.message);
  } else {
    const categories = categoryResult.error
      ? useDataStore.getState().categories
      : categoryResult.data || [];
    const products = (productResult.data || []).map((product: any) => {
      const category = categories.find((item) => item.id === product.category_id);
      return {
        ...product,
        price: Number(product.price),
        discount_percent: Number(product.discount_percent || 0),
        stock: Number(product.stock || 0),
        category_slug: category?.slug || "",
        category_name: category?.name_en || "",
      } as Product;
    });
    useDataStore.setState({ products });
  }

  if (bannerResult.error) {
    console.error("Unable to load storefront banners:", bannerResult.error.message);
  } else {
    const banners = (bannerResult.data || []).map((banner: any) => ({
      ...banner,
      title: banner.title_en || "",
      subtitle: banner.subtitle_en || "",
      link_url: banner.link_url || null,
      cta_link: banner.link_url || "",
    }));
    useDataStore.setState({ banners });
  }

  if (rateResult.error) {
    console.error("Unable to load delivery rates:", rateResult.error.message);
  } else {
    useDataStore.setState({
      deliveryRates: (rateResult.data || []).map((rate: any) => ({
        ...rate,
        charge: Number(rate.charge),
      })),
    });
  }

  if (settingsResult.error) {
    console.error("Unable to load site settings:", settingsResult.error.message);
  } else {
    const values = Object.fromEntries(
      (settingsResult.data || []).map((item: any) => [item.key, item.value || ""])
    );
    const siteSettings: SiteSettings = {
      jazzcash_number: values.jazzcash_number || "",
      easypaisa_number: values.easypaisa_number || "",
      bank_name: values.bank_name || "",
      bank_account_title: values.bank_account_title || "",
      bank_iban: values.bank_iban || "",
      whatsapp_number: values.whatsapp_number || "",
      contact_phone: values.contact_phone || "",
      contact_email: values.contact_email || "",
      physical_address: values.physical_address || "",
      shop_address: values.physical_address || "",
      instagram_url: values.instagram_url || "",
      facebook_url: values.facebook_url || "",
      tiktok_url: values.tiktok_url || "",
    };
    useDataStore.setState({ siteSettings });
  }
}

export function useProducts() {
  useEffect(() => {
    void loadStorefrontData().catch((error) => {
      console.error("Storefront data loading failed:", error);
      storefrontLoadStarted = false;
    });
  }, []);

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
