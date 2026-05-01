"use client";

import { useEffect, useRef } from "react";

interface PanoramaViewerProps {
  src: string;    // URL to equirectangular 360 image
  title?: string;
}

// Thin wrapper — loads Pannellum from CDN on first render to keep bundle lean.
// Replace with `react-pannellum` or @photo-sphere-viewer if you add them via npm.
export default function PanoramaViewer({ src, title }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // Dynamically inject Pannellum CSS + JS from CDN
    const cssId = "pannellum-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

    function initViewer() {
      if (!containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      viewerRef.current = (window as any).pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: src,
        autoLoad: true,
        autoRotate: -2,
        showControls: true,
        compass: false,
        title: title ?? "",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).pannellum !== "undefined") {
      initViewer();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = initViewer;
    document.body.appendChild(script);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (viewerRef.current as any)?.destroy?.();
      viewerRef.current = null;
    };
  }, [src, title]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: "480px" }}
      aria-label={`Ảnh 360° – ${title ?? "Hang động"}`}
    />
  );
}
