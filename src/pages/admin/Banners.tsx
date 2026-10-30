import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { PRODUCT_ARTWORKS } from "../../lib/artworks";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { LuxuryImage } from "../../components/common/LuxuryImage";

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
      subtitle_en: "Limited Atelier Release — Handcrafted in Lahore",
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Homepage Hero Banners
          </h1>
          <p className="text-xs text-[#4A4A4A]">
            Upload, reorder, activate/deactivate, or delete campaign banners on the storefront hero.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5 space-y-4 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="bn-en" className="text-xs font-medium text-[#4A4A4A]">
                Banner Headline (EN) *
              </label>
              <input
                id="bn-en"
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Winter Shawl & Karandi Edit"
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-ur" className="text-xs font-medium text-[#4A4A4A]">
                Urdu Subtitle (اردو)
              </label>
              <input
                id="bn-ur"
                type="text"
                dir="rtl"
                value={titleUr}
                onChange={(e) => setTitleUr(e.target.value)}
                placeholder="موسم سرما کا خاص کلیکشن"
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-urdu text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-link" className="text-xs font-medium text-[#4A4A4A]">
                Destination Route
              </label>
              <input
                id="bn-link"
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="bn-file" className="text-xs font-medium text-[#4A4A4A]">
                Banner Artwork Image
              </label>
              <label
                htmlFor="bn-file"
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] hover:border-[#C9A84C] text-xs text-[#1A1A1A] flex items-center gap-2 cursor-pointer truncate"
              >
                <Upload className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
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
              className="h-10 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#E2C07A] disabled:opacity-60"
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
              className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden flex flex-col justify-between shadow-sm"
            >
              <div className="aspect-[16/9] bg-[#F5F4F0] border-b border-[#E8E0D0]">
                <LuxuryImage
                  src={ban.image_url}
                  alt={ban.title_en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#C9A84C]">
                      #{ban.display_order}
                    </span>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {ban.title_en}
                    </p>
                  </div>
                  <p className="text-xs font-mono text-[#9B7B2F] mt-0.5">
                    Link: {ban.link_url}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => reorderBanner(ban.id, "up")}
                    aria-label={`Move ${ban.title_en} up`}
                    className="p-1.5 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-[#4A4A4A] hover:text-[#1A1A1A] hover:border-[#C9A84C]"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderBanner(ban.id, "down")}
                    aria-label={`Move ${ban.title_en} down`}
                    className="p-1.5 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-[#4A4A4A] hover:text-[#1A1A1A] hover:border-[#C9A84C]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateBanner(ban.id, { is_active: !ban.is_active })
                    }
                    className={`px-3 py-1 rounded text-xs font-semibold border ${
                      ban.is_active
                        ? "bg-[#16A34A]/10 border-[#16A34A]/30 text-[#16A34A]"
                        : "bg-[#F5F4F0] border-[#E8E0D0] text-[#9A9A9A]"
                    }`}
                  >
                    {ban.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBanner(ban.id)}
                    aria-label="Delete banner"
                    className="p-1.5 text-[#9A9A9A] hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
