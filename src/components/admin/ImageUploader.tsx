import React, { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";
import { PRODUCT_ARTWORKS } from "../../lib/artworks";

export interface PendingUploadItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  images: string[];
  onImagesChange?: (images: string[]) => void;
  onChange?: (images: string[]) => void;
  pendingFiles?: PendingUploadItem[];
  onPendingFilesChange?: (files: PendingUploadItem[]) => void;
  maxImages?: number;
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
}) => {
  const updateImages = (next: string[]) => {
    onImagesChange?.(next);
    onChange?.(next);
  };

  const [customUrl, setCustomUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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

  const processFiles = (files: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length + pendingFiles.length + fileArray.length > maxImages) {
      setErrorMessage(`You can upload up to ${maxImages} images per product.`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMessage(
          `Invalid file format "${file.name}". Only JPG, PNG, and WebP images are allowed.`
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `File "${file.name}" exceeds the 5MB maximum size limit.`
        );
        return;
      }
      validFiles.push(file);
    }

    setUploadProgress(20);
    const interval = window.setInterval(() => {
      setUploadProgress((prev) =>
        prev !== null && prev < 90 ? prev + 25 : prev
      );
    }, 80);

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise<{ file: File; dataUrl: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ file, dataUrl: reader.result as string });
            reader.onerror = () =>
              reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          })
      )
    )
      .then((results) => {
        window.clearInterval(interval);
        setUploadProgress(100);

        if (onPendingFilesChange) {
          const newPending: PendingUploadItem[] = results.map((r, i) => ({
            id: `pending-${Date.now()}-${i}`,
            file: r.file,
            previewUrl: r.dataUrl,
          }));
          onPendingFilesChange([...pendingFiles, ...newPending]);
        } else {
          const merged = [...images];
          for (const r of results) {
            if (!merged.includes(r.dataUrl)) {
              merged.push(r.dataUrl);
            }
          }
          updateImages(merged);
        }

        setSuccessMessage(
          `${validFiles.length} image${
            validFiles.length > 1 ? "s" : ""
          } validated & staged.`
        );
        window.setTimeout(() => {
          setUploadProgress(null);
        }, 500);
      })
      .catch(() => {
        window.clearInterval(interval);
        setUploadProgress(null);
        setErrorMessage(
          "Could not process the selected image file. Please try again."
        );
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#4A4A4A]">
          Product Gallery Images (Primary + Angles · Max {maxImages})
        </span>
        <span className="text-[11px] font-mono text-[#9A9A9A]">
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
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? "border-[#C9A84C] bg-[#C9A84C]/10"
            : "border-[#E8E0D0] bg-[#FFFFFF] hover:border-[#C9A84C]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) {
              processFiles(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />
        <div className="w-11 h-11 mx-auto mb-2.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-[#1A1A1A]">
          Drag & drop product photos here or click to browse
        </p>
        <p className="text-[11px] text-[#4A4A4A] mt-1">
          Supports JPG, PNG, WebP (Max 5MB per image · Reorder or set Primary
          below)
        </p>

        {uploadProgress !== null && (
          <div className="mt-3 max-w-xs mx-auto">
            <div className="h-1.5 w-full rounded bg-[#E8E0D0] overflow-hidden">
              <div
                className="h-full bg-[#C9A84C] transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#9B7B2F] mt-1 font-mono">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && !errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Existing & Staged Preview Grid with Reordering & Primary Selection */}
      {(images.length > 0 || pendingFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={`${img.slice(0, 24)}-${idx}`}
              className={`relative group rounded-lg border bg-[#FFFFFF] overflow-hidden ${
                idx === 0
                  ? "border-[#C9A84C] ring-1 ring-[#C9A84C]"
                  : "border-[#E8E0D0]"
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={img}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                {idx === 0 ? (
                  <span className="bg-[#C9A84C] text-[#1A1A1A] text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider inline-flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className="bg-[#1A1A1A]/85 text-white hover:bg-[#C9A84C] hover:text-[#1A1A1A] text-[9px] font-semibold uppercase px-2 py-0.5 rounded tracking-wider transition-colors"
                  >
                    Set Primary
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  aria-label="Remove image"
                  className="p-1.5 rounded bg-[#1A1A1A]/85 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex items-center justify-between bg-[#F5F4F0] border-t border-[#E8E0D0] px-2 py-1 text-[10px] font-mono text-[#4A4A4A]">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, -1)}
                    className="p-1 hover:text-[#C9A84C] disabled:opacity-30"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>#{idx + 1}</span>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => moveImage(idx, 1)}
                    className="p-1 hover:text-[#C9A84C] disabled:opacity-30"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {pendingFiles.map((item, idx) => (
            <div
              key={item.id}
              className="relative rounded-lg border border-dashed border-[#C9A84C] bg-[#FFFFFF] overflow-hidden"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={item.previewUrl}
                  alt={`Pending upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="bg-[#C9A84C] text-[#1A1A1A] text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                  Staged
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onPendingFilesChange?.(
                      pendingFiles.filter((f) => f.id !== item.id)
                    )
                  }
                  className="p-1.5 rounded bg-[#1A1A1A]/85 text-white hover:bg-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional Direct URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Or paste direct image URL (https://...)"
          className="flex-1 h-9 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] px-3 text-xs text-[#1A1A1A] focus:border-[#C9A84C] focus:outline-none placeholder:text-[#9A9A9A]"
        />
        <button
          type="button"
          onClick={() => addImage(customUrl)}
          className="px-4 h-9 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#E2C07A] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Studio Preset Library */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[#4A4A4A] mb-2 flex items-center gap-1.5 font-medium">
          <ImageIcon className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Quick-Select RTS Studio Lookbook Presets:</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRODUCT_ARTWORKS)
            .slice(0, 8)
            .map(([key, url]) => (
              <button
                key={key}
                type="button"
                onClick={() => addImage(url)}
                className="px-2.5 py-1 rounded text-[11px] bg-[#FFFFFF] border border-[#E8E0D0] text-[#4A4A4A] hover:border-[#C9A84C] hover:text-[#1A1A1A] transition-colors capitalize"
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
