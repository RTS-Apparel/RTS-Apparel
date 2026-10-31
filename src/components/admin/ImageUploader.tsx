import React, { useRef, useState } from "react";
import {
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";
import { PRODUCT_ARTWORKS } from "../../lib/artworks";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export interface PendingUploadItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface PerFileUploadStatus {
  name: string;
  progress: number;
  error?: string;
}

interface ImageUploaderProps {
  images: string[];
  onImagesChange?: (images: string[]) => void;
  onChange?: (images: string[]) => void;
  pendingFiles?: PendingUploadItem[];
  onPendingFilesChange?: (files: PendingUploadItem[]) => void;
  maxImages?: number;
  productId?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  onChange,
  pendingFiles = [],
  onPendingFilesChange,
  maxImages = 6,
  productId = "draft",
}) => {
  const updateImages = (next: string[]) => {
    onImagesChange?.(next);
    onChange?.(next);
  };

  const [customUrl, setCustomUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<PerFileUploadStatus[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = (url: string) => {
    if (!url.trim()) return;
    if (images.length >= maxImages) {
      setErrorMessage(`Maximum ${maxImages} images allowed per product.`);
      return;
    }
    if (!images.includes(url.trim())) {
      updateImages([...images, url.trim()]);
    }
    setCustomUrl("");
  };

  const removeImage = (idx: number) => {
    updateImages(images.filter((_, i) => i !== idx));
  };

  const setPrimaryImage = (idx: number) => {
    if (idx === 0) return;
    const selected = images[idx];
    const remaining = images.filter((_, i) => i !== idx);
    updateImages([selected, ...remaining]);
  };

  const moveImage = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateImages(updated);
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const processFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const availableSlots = maxImages - (images.length + pendingFiles.length);
    if (availableSlots <= 0) {
      setErrorMessage(`You can upload up to ${maxImages} images per product.`);
      return;
    }

    const filesToProcess = fileArray.slice(0, availableSlots);
    const initialStatuses: PerFileUploadStatus[] = filesToProcess.map((f) => ({
      name: f.name,
      progress: 10,
    }));
    setFileStatuses(initialStatuses);

    const uploadedUrls: string[] = [];
    const newPendingItems: PendingUploadItem[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];

      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, progress: 0, error: "Invalid format (JPG, PNG, WebP only)" }
              : s
          )
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, progress: 0, error: "Exceeds 5MB limit — skipped" }
              : s
          )
        );
        continue;
      }

      setFileStatuses((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, progress: 55 } : s))
      );

      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `product-images/${productId}/${Date.now()}_${safeName}`;

        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(path, file, { cacheControl: "3600", upsert: false });

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(path);
            if (urlData?.publicUrl) {
              uploadedUrls.push(urlData.publicUrl);
              setFileStatuses((prev) =>
                prev.map((s, idx) => (idx === i ? { ...s, progress: 100 } : s))
              );
              continue;
            }
          }
        }

        // Local preview dataURL fallback when Supabase Storage is not configured or bucket is offline
        const dataUrl = await readFileAsDataUrl(file);
        if (onPendingFilesChange) {
          newPendingItems.push({
            id: `pending-${Date.now()}-${i}`,
            file,
            previewUrl: dataUrl,
          });
        } else {
          uploadedUrls.push(dataUrl);
        }

        setFileStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, progress: 100 } : s))
        );
      } catch (err) {
        setFileStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, progress: 0, error: `Upload failed: ${String(err)}` }
              : s
          )
        );
      }
    }

    if (newPendingItems.length > 0 && onPendingFilesChange) {
      onPendingFilesChange([...pendingFiles, ...newPendingItems]);
    }

    if (uploadedUrls.length > 0) {
      const merged = [...images];
      for (const u of uploadedUrls) {
        if (!merged.includes(u)) merged.push(u);
      }
      updateImages(merged);
    }

    const totalAdded = uploadedUrls.length + newPendingItems.length;
    if (totalAdded > 0) {
      setSuccessMessage(
        `${totalAdded} image${totalAdded > 1 ? "s" : ""} ready in gallery.`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#1A1A1A]">
          Product Gallery Images (Primary + Angles · Max {maxImages})
        </span>
        <span className="text-[11px] font-mono font-bold text-[#E63946]">
          {images.length + pendingFiles.length} / {maxImages} images
        </span>
      </div>

      {/* Drag & Drop + Click File Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) {
            processFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-[8px] border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? "border-[#E63946] bg-[#FFF5F5]"
            : "border-[#E0E0E0] bg-[#F5F5F5] hover:border-[#E63946]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) {
              processFiles(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />
        <div className="w-11 h-11 mx-auto mb-2.5 rounded-full bg-[#E63946] flex items-center justify-center text-[#FFFFFF]">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-[#1A1A1A]">
          Drag & drop product photos here or click to browse
        </p>
        <p className="text-[11px] text-[#666666] mt-1">
          Supports JPG, PNG, WebP (Max {maxImages} images · 5MB per image)
        </p>
      </div>

      {/* Per-image upload progress & errors */}
      {fileStatuses.length > 0 && (
        <div className="space-y-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[6px] p-3">
          {fileStatuses.map((st, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#1A1A1A] truncate max-w-[200px]">
                  {st.name}
                </span>
                {st.error ? (
                  <span className="text-[#E63946] font-medium">{st.error}</span>
                ) : (
                  <span className="text-[#E63946] font-mono font-bold">
                    {st.progress}%
                  </span>
                )}
              </div>
              {!st.error && (
                <div className="h-1.5 w-full rounded bg-[#E0E0E0] overflow-hidden">
                  <div
                    className="h-full bg-[#E63946] transition-all duration-200"
                    style={{ width: `${st.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-[6px] bg-[#F8D7DA] border border-[#E63946] text-[#721C24] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && !errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-[6px] bg-[#D4EDDA] border border-[#22C55E] text-[#155724] text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#155724]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 80x80 Preview Thumbnails + Primary/Order Controls */}
      {(images.length > 0 || pendingFiles.length > 0) && (
        <div className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#666666]">
            Preview Thumbnails (80×80 · Click X to remove)
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div
                key={`${img.slice(0, 24)}-${idx}`}
                className={`relative group rounded-[6px] border bg-[#FFFFFF] p-1.5 flex flex-col items-center gap-1.5 ${
                  idx === 0
                    ? "border-[#E63946] ring-1 ring-[#E63946]"
                    : "border-[#E0E0E0]"
                }`}
              >
                <div className="relative w-20 h-20 rounded overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={img}
                    alt={`Product thumbnail ${idx + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label={`Remove image ${idx + 1}`}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#E63946] text-[#FFFFFF] flex items-center justify-center hover:bg-[#C1121F] transition-colors shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between w-20 text-[9px] font-mono text-[#666666]">
                  {idx === 0 ? (
                    <span className="text-[#E63946] font-bold inline-flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Main
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="text-[#1A1A1A] hover:text-[#E63946] underline"
                    >
                      Set Main
                    </button>
                  )}

                  {images.length > 1 && (
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, -1)}
                        className="text-[#1A1A1A] hover:text-[#E63946] disabled:opacity-30"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => moveImage(idx, 1)}
                        className="text-[#1A1A1A] hover:text-[#E63946] disabled:opacity-30"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {pendingFiles.map((item, idx) => (
              <div
                key={item.id}
                className="relative rounded-[6px] border border-dashed border-[#E63946] bg-[#FFFFFF] p-1.5 flex flex-col items-center gap-1.5"
              >
                <div className="relative w-20 h-20 rounded overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={item.previewUrl}
                    alt={`Pending upload ${idx + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onPendingFilesChange?.(
                        pendingFiles.filter((f) => f.id !== item.id)
                      )
                    }
                    aria-label="Remove staged image"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#E63946] text-[#FFFFFF] flex items-center justify-center hover:bg-[#C1121F]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[9px] font-mono text-[#E63946] font-bold uppercase">
                  Staged
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Direct URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Or paste direct image URL (https://...)"
          className="flex-1 h-9 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] px-3 text-xs text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none placeholder:text-[#999999]"
        />
        <button
          type="button"
          onClick={() => addImage(customUrl)}
          className="px-4 h-9 rounded-[6px] bg-[#E63946] text-[#FFFFFF] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#C1121F] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Studio Preset Library */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-1.5 font-semibold">
          <ImageIcon className="w-3.5 h-3.5 text-[#E63946]" />
          <span>Quick-Select ARTS APPAREL Studio Lookbook Presets:</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRODUCT_ARTWORKS)
            .slice(0, 8)
            .map(([key, url]) => (
              <button
                key={key}
                type="button"
                onClick={() => addImage(url)}
                className="px-2.5 py-1 rounded-[4px] text-[11px] bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] transition-colors capitalize font-medium"
              >
                + {key.replace(/([A-Z])/g, " $1")}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
