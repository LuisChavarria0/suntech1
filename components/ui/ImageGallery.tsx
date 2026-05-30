"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div
        className={[
          "grid gap-3",
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
            ? "grid-cols-2"
            : images.length === 3
            ? "grid-cols-2"
            : "grid-cols-2 md:grid-cols-3",
        ].join(" ")}
      >
        {images.map((src, i) => {
          const isHero = i === 0 && images.length >= 3;
          return (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className={[
                "group relative overflow-hidden rounded-xl bg-navy-800 cursor-pointer",
                isHero ? "col-span-2 row-span-2 h-80 md:h-[420px]" : "h-52 md:h-64",
              ].join(" ")}
              onClick={() => open(i)}
            >
              <Image
                src={src}
                alt={`${title} — imagen ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes={isHero ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Index badge */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i + 1}/{images.length}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={close}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/70 z-10">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 md:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative w-full max-w-4xl max-h-[80vh] aspect-video rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex]}
                  alt={`${title} — imagen ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={[
                      "relative w-12 h-8 rounded-md overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                      i === lightboxIndex
                        ? "border-gold-400 scale-110"
                        : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100",
                    ].join(" ")}
                  >
                    <Image
                      src={src}
                      alt={`thumb ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
