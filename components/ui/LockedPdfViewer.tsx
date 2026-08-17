"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";

export function LockedPdfViewer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;

    async function render() {
      setLoading(true);
      setError(false);

      const pdfjsLib = await import("pdfjs-dist");
      // Worker file is a static copy of node_modules/pdfjs-dist/build/pdf.worker.min.mjs —
      // re-copy it to public/ whenever the pdfjs-dist dependency version changes.
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      try {
        loadingTask = pdfjsLib.getDocument({ url: src });
        const doc = await loadingTask.promise;
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        const containerWidth = containerRef.current.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const page = await doc.getPage(pageNum);
          if (cancelled) return;

          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / unscaledViewport.width;
          const viewport = page.getViewport({ scale: scale * dpr });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.marginBottom = "8px";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          if (cancelled) return;
          containerRef.current?.appendChild(canvas);
        }

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [src]);

  return (
    <div
      className="relative h-full w-full overflow-y-auto bg-slate-100 select-none"
      style={{ touchAction: "pinch-zoom pan-y" }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 border-3 border-navy-800 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-500">
          No se pudo cargar el documento.
        </div>
      )}
      <div ref={containerRef} className="p-3" />
    </div>
  );
}
