"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  value:    string;
  onChange: (url: string) => void;
  folder:   string;
  label?:   string;
}

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}

export default function ImageUploader({ value, onChange, folder, label = "Ảnh thumbnail" }: Props) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [progress,  setProgress]  = useState(0);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file",   file);
    formData.append("folder", folder);

    try {
      setProgress(40);
      const res  = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      setProgress(80);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload thất bại"); return; }
      onChange(data.url);
      setProgress(100);
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); }

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </label>

      {value ? (
        /* Preview */
        <div className="group relative overflow-hidden rounded-xl border border-gray-200"
          style={{ aspectRatio: "16/9", maxHeight: 200 }}>
          <Image src={value} alt="thumbnail" fill className="object-cover" sizes="600px" />
          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2
                          bg-black/50 opacity-0 transition group-hover:opacity-100">
            <button type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-xl bg-white px-4 py-2 text-[12px] font-bold text-gray-900 hover:bg-gray-100 disabled:opacity-50">
              {uploading ? `Đang tải… ${progress}%` : "Thay ảnh"}
            </button>
            <button type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              className="text-[11px] font-semibold text-white/80 hover:text-white disabled:opacity-50">
              Xóa ảnh
            </button>
          </div>
          {uploading && (
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }} />
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="flex cursor-pointer flex-col items-center justify-center gap-2
                     rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
                     py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
          style={{ minHeight: 120 }}>

          {uploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-[12px] font-semibold text-emerald-600">Đang tải lên… {progress}%</p>
              <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-gray-600">Kéo ảnh vào đây hoặc <span className="text-emerald-600">chọn file</span></p>
              <p className="text-[11px] text-gray-400">JPG, PNG, WebP — tối đa 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-red-600">⚠️ {error}</p>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
    </div>
  );
}
