"use client";

import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type ProductImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ProductImageUploader({
  value,
  onChange,
}: ProductImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const currentPreview = useMemo(() => {
    if (previewUrl) return previewUrl;
    return "";
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setSelectedFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post("/api/admin/upload-image", formData);

      const imageUrl = res.data?.imageUrl;
      if (!imageUrl) {
        setError("Upload succeeded but no image URL was returned.");
        return;
      }

      onChange(imageUrl);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Upload Product Image
      </label>

      <div className="mb-4 flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
        {currentPreview ? (
          <img
            src={currentPreview}
            alt="Selected preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 15a4 4 0 014-4h.26A8 8 0 1118 17H7a4 4 0 01-4-4z"
              />
            </svg>

            <p className="text-sm font-medium">No image selected</p>
            <p className="text-xs text-gray-400">
              Select an image to preview it here
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          id="product-image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <label
          htmlFor="product-image-upload"
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
        >
          Choose Image
        </label>

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploading ? "Uploading..." : "Upload to Cloudinary"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
          placeholder="Cloudinary image URL will appear here"
        />
      </div>
    </div>
  );
}