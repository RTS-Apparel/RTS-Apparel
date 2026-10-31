import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { PRODUCT_ARTWORKS } from "../../lib/artworks";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import {
  ImageUploader,
  PendingUploadItem,
} from "../../components/admin/ImageUploader";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { pageVariants } from "../../lib/animations";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const products = useDataStore((s) => s.products);
  const categories = useDataStore((s) => s.categories);
  const addProduct = useDataStore((s) => s.addProduct);
  const updateProduct = useDataStore((s) => s.updateProduct);
  const addToast = useDataStore((s) => s.addToast);
  const adminLanguage = useDataStore((s) => s.adminLanguage);

  const t = ADMIN_TRANSLATIONS[adminLanguage];

  const existing = id ? products.find((p) => p.id === id) : undefined;

  const [nameEn, setNameEn] = useState(existing?.name_en || "");
  const [nameUr, setNameUr] = useState(existing?.name_ur || "");
  const [nameRomanUr, setNameRomanUr] = useState(
    existing?.name_roman_ur || ""
  );
  const [descEn, setDescEn] = useState(existing?.description_en || "");
  const [descUr, setDescUr] = useState(existing?.description_ur || "");
  const [descRomanUr, setDescRomanUr] = useState(
    existing?.description_roman_ur || ""
  );
  const [categoryId, setCategoryId] = useState(
    existing?.category_id || categories[0]?.id || "cat-kurta"
  );
  const [price, setPrice] = useState(String(existing?.price || 11500));
  const [discountPercent, setDiscountPercent] = useState(
    String(existing?.discount_percent || 0)
  );
  const [stock, setStock] = useState(String(existing?.stock || 20));
  const [sizes, setSizes] = useState<string[]>(
    existing?.sizes || ["S", "M", "L", "XL"]
  );
  const [colorsInput, setColorsInput] = useState(
    existing?.colors.join(", ") || "Obsidian Black, Midnight Gold"
  );
  const [images, setImages] = useState<string[]>(
    existing?.images && existing.images.length > 0
      ? existing.images
      : [PRODUCT_ARTWORKS.kurtaObsidian]
  );
  const [pendingFiles, setPendingFiles] = useState<PendingUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const [isActive, setIsActive] = useState(existing?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(existing?.is_featured ?? true);

  const toggleSize = (sz: string) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadErrors([]);

    const productId = existing?.id || `prod-${Date.now()}`;
    const uploadedUrls: string[] = [...images];
    const failedMessages: string[] = [];

    if (pendingFiles.length > 0) {
      setIsUploading(true);

      for (let i = 0; i < pendingFiles.length; i++) {
        const item = pendingFiles[i];
        const file = item.file;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `product-images/${productId}/${Date.now()}_${safeName}`;

        if (isSupabaseConfigured && supabase) {
          try {
            const { error } = await supabase.storage
              .from("product-images")
              .upload(path, file, { cacheControl: "3600", upsert: false });

            if (error) {
              const msg = `Image ${i + 1} (${file.name}) upload failed, skipping`;
              failedMessages.push(msg);
              addToast(msg, "error");
            } else {
              const {
                data: { publicUrl },
              } = supabase.storage.from("product-images").getPublicUrl(path);
              uploadedUrls.push(publicUrl);
            }
          } catch {
            const msg = `Image ${i + 1} (${file.name}) upload failed, skipping`;
            failedMessages.push(msg);
            addToast(msg, "error");
          }
        } else {
          uploadedUrls.push(item.previewUrl);
        }
      }

      setIsUploading(false);
    }

    if (failedMessages.length > 0) {
      setUploadErrors(failedMessages);
    }

    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const finalImages =
      uploadedUrls.length > 0
        ? uploadedUrls.slice(0, 6)
        : [PRODUCT_ARTWORKS.kurtaObsidian];

    const payload = {
      name_en: nameEn.trim(),
      name_ur: nameUr.trim() || null,
      name_roman_ur: nameRomanUr.trim() || nameEn.trim(),
      description_en: descEn.trim() || null,
      description_ur: descUr.trim() || null,
      description_roman_ur: descRomanUr.trim() || descEn.trim() || null,
      category_id: categoryId,
      price: Number(price) || 0,
      discount_percent: Number(discountPercent) || 0,
      stock: Number(stock) || 0,
      sizes: sizes.length > 0 ? sizes : ["M", "L"],
      colors: colors.length > 0 ? colors : ["Black"],
      images: finalImages,
      is_active: isActive,
      is_featured: isFeatured,
    };

    if (existing) {
      updateProduct(existing.id, payload);
    } else {
      addProduct(payload);
    }
    navigate("/admin/products");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title={existing ? "Edit Product" : "Add Product"}
          subtitle="Manage your product catalog"
          icon={<Shirt className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Products", to: "/admin/products" },
            { label: existing ? "Edit Product" : "Add Product" },
          ]}
          actions={
            <Link
              to="/admin/products"
              className="px-3.5 py-2 rounded-[6px] bg-[#E63946] text-xs text-[#FFFFFF] flex items-center gap-1.5 hover:bg-[#C1121F] font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {t.products}</span>
            </Link>
          }
        />

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-5 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="pf-name-en"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Product Name (English) *
              </label>
              <input
                id="pf-name-en"
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Royal Zari Karandi Kurta"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-name-roman"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Product Name (Roman Urdu)
              </label>
              <input
                id="pf-name-roman"
                type="text"
                value={nameRomanUr}
                onChange={(e) => setNameRomanUr(e.target.value)}
                placeholder="e.g. Shahi Zari Karandi Kurta"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-name-ur"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Product Name (Customer Urdu)
              </label>
              <input
                id="pf-name-ur"
                type="text"
                dir="rtl"
                value={nameUr}
                onChange={(e) => setNameUr(e.target.value)}
                placeholder="شاہی زری کرنڈی کرتہ"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-urdu text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="pf-cat"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                {t.categories} *
              </label>
              <select
                id="pf-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-price"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Price (PKR) *
              </label>
              <input
                id="pf-price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-disc"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Discount %
              </label>
              <input
                id="pf-disc"
                type="number"
                min={0}
                max={90}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-stock"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Stock Quantity *
              </label>
              <input
                id="pf-stock"
                type="number"
                min={0}
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-[#1A1A1A] block">
              Available Sizes
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-mono border transition-colors ${
                    sizes.includes(sz)
                      ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946] font-bold"
                      : "bg-[#FFFFFF] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="pf-colors"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Colors (Comma separated)
            </label>
            <input
              id="pf-colors"
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          {/* Multiple Image Uploader */}
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            pendingFiles={pendingFiles}
            onPendingFilesChange={setPendingFiles}
            maxImages={6}
          />

          {uploadErrors.length > 0 && (
            <div className="rounded-[6px] bg-[#F8D7DA] border border-[#E63946] p-3 space-y-1">
              {uploadErrors.map((err, i) => (
                <p key={i} className="text-xs text-[#721C24]">
                  {err}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="pf-desc-en"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Description (English)
              </label>
              <textarea
                id="pf-desc-en"
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-desc-roman"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Description (Roman Urdu)
              </label>
              <textarea
                id="pf-desc-roman"
                rows={3}
                value={descRomanUr}
                onChange={(e) => setDescRomanUr(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pf-desc-ur"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Description (Customer Urdu)
              </label>
              <textarea
                id="pf-desc-ur"
                rows={3}
                dir="rtl"
                value={descUr}
                onChange={(e) => setDescUr(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-urdu text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#1A1A1A] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#E63946]"
              />
              <span>Active in Storefront</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#1A1A1A] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#E63946]"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] disabled:bg-[#E0E0E0] disabled:text-[#999999] flex items-center gap-2 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading images...</span>
              </>
            ) : existing ? (
              t.saveChanges
            ) : (
              t.addProduct
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminProductForm;
