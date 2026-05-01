"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function SettingsPage() {
  const [heroUrl,   setHeroUrl]   = useState("/hero.jpg");
  const [urlInput,  setUrlInput]  = useState("/hero.jpg");
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");
  const [dragOver,  setDragOver]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [weatherUrl,      setWeatherUrl]      = useState("");
  const [weatherInput,    setWeatherInput]    = useState("");
  const [weatherUploading,setWeatherUploading]= useState(false);
  const [weatherSaving,   setWeatherSaving]   = useState(false);
  const [weatherSaved,    setWeatherSaved]    = useState(false);
  const [weatherDragOver, setWeatherDragOver] = useState(false);
  const weatherFileRef = useRef<HTMLInputElement>(null);

  const [aboutUrl,      setAboutUrl]      = useState("");
  const [aboutInput,    setAboutInput]    = useState("");
  const [aboutUploading,setAboutUploading]= useState(false);
  const [aboutSaving,   setAboutSaving]   = useState(false);
  const [aboutSaved,    setAboutSaved]    = useState(false);
  const [aboutDragOver, setAboutDragOver] = useState(false);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings?key=hero_image_url")
      .then(r => r.json())
      .then(d => { const v = d.value ?? "/hero.jpg"; setHeroUrl(v); setUrlInput(v); })
      .catch(() => {});
    fetch("/api/admin/settings?key=weather_bg_url")
      .then(r => r.json())
      .then(d => { const v = d.value ?? ""; setWeatherUrl(v); setWeatherInput(v); })
      .catch(() => {});
    fetch("/api/admin/settings?key=about_image_url")
      .then(r => r.json())
      .then(d => { const v = d.value ?? ""; setAboutUrl(v); setAboutInput(v); })
      .catch(() => {});
  }, []);

  const saveUrl = useCallback(async (url: string) => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ key: "hero_image_url", value: url }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(`Lỗi lưu cài đặt: ${data.error ?? res.status}`); return; }
    setHeroUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "hero");
      const res  = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(`Upload thất bại: ${data.error ?? `HTTP ${res.status}`}`);
        setUploading(false);
        return;
      }
      setUrlInput(data.url);
      setUploading(false);
      // Tự động lưu ngay sau khi upload xong
      await saveUrl(data.url);
    } catch (e) {
      setError(`Lỗi kết nối: ${e instanceof Error ? e.message : "unknown"}`);
      setUploading(false);
    }
  }, [saveUrl]);

  async function handleSave() {
    setError("");
    await saveUrl(urlInput);
  }

  const saveWeatherUrl = useCallback(async (url: string) => {
    setWeatherSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "weather_bg_url", value: url }),
    });
    setWeatherSaving(false);
    if (!res.ok) return;
    setWeatherUrl(url);
    setWeatherSaved(true);
    setTimeout(() => setWeatherSaved(false), 2500);
  }, []);

  const handleWeatherUpload = useCallback(async (file: File) => {
    setWeatherUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "settings");
    const res  = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setWeatherUploading(false);
    if (!res.ok || !data.url) return;
    setWeatherInput(data.url);
    await saveWeatherUrl(data.url);
  }, [saveWeatherUrl]);

  const saveAboutUrl = useCallback(async (url: string) => {
    setAboutSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "about_image_url", value: url }),
    });
    setAboutSaving(false);
    if (!res.ok) return;
    setAboutUrl(url);
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2500);
  }, []);

  const handleAboutUpload = useCallback(async (file: File) => {
    setAboutUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "settings");
    const res  = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setAboutUploading(false);
    if (!res.ok || !data.url) return;
    setAboutInput(data.url);
    await saveAboutUrl(data.url);
  }, [saveAboutUrl]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleUpload(file);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-[20px] font-black text-gray-900">Cài đặt Website</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Cấu hình hình ảnh và nội dung hiển thị trên trang chủ</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">🖼️</div>
          <div>
            <h2 className="text-[14px] font-bold text-gray-900">Ảnh Hero Banner</h2>
            <p className="text-[11px] text-gray-400">Ảnh toàn màn hình ở trang chủ · 1920×1080px · dưới 5MB</p>
          </div>
        </div>

      {/* Preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
        {heroUrl && (
          <Image
            key={heroUrl}
            src={heroUrl}
            alt="Hero banner preview"
            fill
            className="object-cover"
            unoptimized={heroUrl.startsWith("http")}
          />
        )}
        <div className="absolute inset-0 flex items-end p-4">
          <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            Preview
          </span>
        </div>
      </div>

      {/* Drop zone / upload */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center
                    transition-colors cursor-pointer
                    ${dragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
        onClick={() => fileRef.current?.click()}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl
                         ${dragOver ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
          {uploading
            ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-emerald-600" />
            : <UploadIcon />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {uploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây, hoặc click để chọn"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">JPG, PNG, WebP · Tối đa 5MB</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />
      </div>

      {/* URL input */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc nhập URL</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder="https://... hoặc /hero.jpg"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900
                     placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none
                     focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || uploading || !urlInput}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5
                     text-sm font-semibold text-white transition-all
                     hover:bg-gray-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50
                           px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckIcon /> Đã lưu!
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-400">
        Sau khi upload, hệ thống tự động lưu. Trang chủ cập nhật trong vòng 30 giây.
      </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-lg">⛅</div>
          <div>
            <h2 className="text-[14px] font-bold text-gray-900">Ảnh Nền Thời Tiết</h2>
            <p className="text-[11px] text-gray-400">Ảnh nền section thời tiết trang chủ · Phong cảnh thiên nhiên</p>
          </div>
        </div>

      {weatherUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
          <Image key={weatherUrl} src={weatherUrl} alt="Weather bg preview" fill
            className="object-cover" unoptimized={weatherUrl.startsWith("http")} />
          <div className="absolute inset-0 flex items-end p-4">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">Preview</span>
          </div>
        </div>
      )}

      <div
        onDragOver={e => { e.preventDefault(); setWeatherDragOver(true); }}
        onDragLeave={() => setWeatherDragOver(false)}
        onDrop={e => { e.preventDefault(); setWeatherDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleWeatherUpload(f); }}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center
                    transition-colors cursor-pointer
                    ${weatherDragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
        onClick={() => weatherFileRef.current?.click()}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl
                         ${weatherDragOver ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
          {weatherUploading
            ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-emerald-600" />
            : <UploadIcon />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {weatherUploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây, hoặc click để chọn"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">JPG, PNG, WebP · Tối đa 5MB</p>
        </div>
        <input ref={weatherFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleWeatherUpload(f); }} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc nhập URL</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <input value={weatherInput} onChange={e => setWeatherInput(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900
                     placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => saveWeatherUrl(weatherInput)} disabled={weatherSaving || weatherUploading || !weatherInput}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5
                     text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:opacity-50">
          {weatherSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {weatherSaved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckIcon /> Đã lưu!
          </span>
        )}
      </div>
      </div>

      {/* ── About Section Image ── */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">🏞️</div>
          <div>
            <h2 className="text-[14px] font-bold text-gray-900">Ảnh Giới Thiệu (About)</h2>
            <p className="text-[11px] text-gray-400">Ảnh hiển thị trong phần "Về Sơn Kiều" trang chủ · Phong cảnh thiên nhiên</p>
          </div>
        </div>

        {aboutUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
            <Image key={aboutUrl} src={aboutUrl} alt="About section preview" fill
              className="object-cover" unoptimized={aboutUrl.startsWith("http")} />
            <div className="absolute inset-0 flex items-end p-4">
              <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">Preview</span>
            </div>
          </div>
        )}

        <div
          onDragOver={e => { e.preventDefault(); setAboutDragOver(true); }}
          onDragLeave={() => setAboutDragOver(false)}
          onDrop={e => { e.preventDefault(); setAboutDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleAboutUpload(f); }}
          className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center
                      transition-colors cursor-pointer
                      ${aboutDragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
          onClick={() => aboutFileRef.current?.click()}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl
                           ${aboutDragOver ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {aboutUploading
              ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-emerald-600" />
              : <UploadIcon />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {aboutUploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây, hoặc click để chọn"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">JPG, PNG, WebP · Tối đa 5MB</p>
          </div>
          <input ref={aboutFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAboutUpload(f); }} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">hoặc nhập URL</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <input value={aboutInput} onChange={e => setAboutInput(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900
                       placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => saveAboutUrl(aboutInput)} disabled={aboutSaving || aboutUploading || !aboutInput}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5
                       text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:opacity-50">
            {aboutSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          {aboutSaved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <CheckIcon /> Đã lưu!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
