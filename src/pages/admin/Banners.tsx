import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Image } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { PRODUCT_ARTWORKS } from "../../lib/artworks";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { LuxuryImage } from "../../components/common/LuxuryImage";
import { pageVariants } from "../../lib/animations";

export const AdminBanners: React.FC = () => {
  const banners = useDataStore((s) => s.banners);
  const addBanner = useDataStore((s) => s.addBanner);
  const updateBanner = useDataStore((s) => s.updateBanner);
  const reorderBanner = useDataStore((s) => s.reorderBanner);
  const deleteBanner = useDataStore((s) => s.deleteBanner);
  const addToast = useDataStore((s) => s.addToast);

  const [titleEn, setTitleEn] = useState("");
  const [titleUr, setTitleUr] = useState("");
  const [linkUrl, setLinkUrl] = useState("/category/kurta-shalwar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const sortedBanners = [...banners].sort(
    (a, b) => a.display_order - b.display_order
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;

    setUploading(true);
    let finalImageUrl = previewUrl || PRODUCT_ARTWORKS.bannerFestive;

    if (selectedFile && isSupabaseConfigured) {
      try {
        const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `banners/${Date.now()}_${cleanName}`;
        const { error } = await supabase.storage
          .from("banners")
          .upload(path, selectedFile, { cacheControl: "3600", upsert: false });

        if (!error) {
          const { data } = supabase.storage.from("banners").getPublicUrl(path);
          if (data?.publicUrl) {
            finalImageUrl = data.publicUrl;
          }
        }
      } catch {
        addToast("Using local banner preview", "info");
      }
    }

    addBanner({
      title_en: titleEn.trim(),
      title_ur: titleUr.trim() || "شاہی ملبوسات",
      subtitle_en: "Limited Atelier Release — ARTS APPAREL",
      image_url: finalImageUrl,
      link_url: linkUrl.trim() || "/category/kurta-shalwar",
      display_order: banners.length + 1,
      is_active: true,
    });
    setTitleEn("");
    setTitleUr("");
    setSelectedFile(null);
    setPreviewUrl("");
    setUploading(false);
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
          title="Banners"
          subtitle="Manage homepage banners"
          icon={<Image className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Banners" },
          ]}
        />

        <form
          onSubmit={handleAdd}
          className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-5 space-y-4 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="bn-en" className="text-xs font-medium text-[#1A1A1A]">
                Banner Headline (EN) *
              </label>
              <input
                id="bn-en"
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Winter Shawl & Karandi Edit"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-ur" className="text-xs font-medium text-[#1A1A1A]">
                Urdu Subtitle (اردو)
              </label>
              <input
                id="bn-ur"
                type="text"
                dir="rtl"
                value={titleUr}
                onChange={(e) => setTitleUr(e.target.value)}
                placeholder="موسم سرما کا خاص کلیکشن"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-urdu text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-link" className="text-xs font-medium text-[#1A1A1A]">
                Destination Route
              </label>
              <input
                id="bn-link"
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-file" className="text-xs font-medium text-[#1A1A1A]">
                Banner Artwork Image
              </label>
              <label
                htmlFor="bn-file"
                className="w-full h-10 px-3 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] text-xs text-[#1A1A1A] flex items-center gap-2 cursor-pointer truncate"
              >
                <Upload className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                <span className="truncate">
                  {selectedFile ? selectedFile.name : "Upload Image..."}
                </span>
                <input
                  id="bn-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="h-10 px-5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#C1121F] disabled:bg-[#E0E0E0] disabled:text-[#999999] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{uploading ? "Uploading Banner..." : "Add Banner"}</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedBanners.map((ban) => (
            <div
              key={ban.id}
              className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] hover:border-[#E63946] transition-colors overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="aspect-[16/9] bg-[#F5F5F5] border-b border-[#E0E0E0]">
                <LuxuryImage
                  src={ban.image_url}
                  alt={ban.title_en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#E63946]">
                      #{ban.display_order}
                    </span>
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      {ban.title_en}
                    </p>
                  </div>
                  <p className="text-xs font-mono text-[#666666] mt-0.5">
                    Link: {ban.link_url}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => reorderBanner(ban.id, "up")}
                    aria-label={`Move ${ban.title_en} up`}
                    className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderBanner(ban.id, "down")}
                    aria-label={`Move ${ban.title_en} down`}
                    className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateBanner(ban.id, { is_active: !ban.is_active })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ban.is_active
                        ? "bg-[#D4EDDA] text-[#155724]"
                        : "bg-[#F8D7DA] text-[#721C24]"
                    }`}
                  >
                    {ban.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBanner(ban.id)}
                    aria-label="Delete banner"
                    className="p-1.5 rounded bg-[#C1121F] text-[#FFFFFF] hover:bg-[#E63946]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBanners;
