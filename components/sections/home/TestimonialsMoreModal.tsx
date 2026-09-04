"use client";

import { useEffect, useState } from "react";
import { X, PlayCircle, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  embedSrcFor,
  thumbnailFor,
  pickText,
  type TestimonialVideo,
} from "@/lib/data/testimonialVideoUtils";
import type { Locale } from "@/lib/data/projectTypes";

export function TestimonialsMoreModal({ videos }: { videos: TestimonialVideo[] }) {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<TestimonialVideo | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // First Escape backs out of the expanded player, the next one closes
      // the whole gallery.
      if (expanded) setExpanded(null);
      else setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, expanded]);

  const closeGallery = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-pulse group mt-4 inline-flex items-center gap-2 justify-center h-13 px-8 bg-gold-500 hover:bg-gold-600 text-white text-base font-semibold rounded-xl shadow-md transition-transform duration-200 hover:scale-105 self-start cursor-pointer"
      >
        {t("cta_more")}
        <ArrowRight className="h-4 w-4 arrow-nudge" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={closeGallery}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85dvh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-navy-900">{t("modal_title")}</h2>
              <button
                onClick={closeGallery}
                aria-label={t("close")}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {videos.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">{t("modal_empty")}</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {videos.map((video) => (
                    <VideoThumb
                      key={video.id}
                      video={video}
                      locale={locale}
                      onOpen={() => setExpanded(video)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {expanded && (
            <div
              className="fixed inset-0 z-110 flex items-center justify-center bg-navy-950/95 p-4 sm:p-8"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(null);
              }}
            >
              <button
                type="button"
                aria-label={t("close")}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(null);
                }}
                className="absolute top-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className={`flex flex-col ${expanded.isVertical ? "max-w-sm" : "max-w-3xl"} w-full`}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative w-full rounded-xl overflow-hidden bg-black ${
                    expanded.isVertical ? "aspect-9/16" : "aspect-video"
                  }`}
                >
                  <iframe
                    src={embedSrcFor(expanded)}
                    title={pickText(expanded.title, locale) || "Testimonio en video"}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                {(pickText(expanded.title, locale) || pickText(expanded.description, locale)) && (
                  <div className="mt-4 text-center">
                    {pickText(expanded.title, locale) && (
                      <p className="font-bold text-white">{pickText(expanded.title, locale)}</p>
                    )}
                    {pickText(expanded.description, locale) && (
                      <p className="mt-1 text-sm text-white/70">
                        {pickText(expanded.description, locale)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function VideoThumb({
  video,
  locale,
  onOpen,
}: {
  video: TestimonialVideo;
  locale: Locale;
  onOpen: () => void;
}) {
  const thumb = thumbnailFor(video);
  const title = pickText(video.title, locale);
  const description = pickText(video.description, locale);

  return (
    <button type="button" onClick={onOpen} className="group text-left cursor-pointer">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-navy-900">
        {thumb && (
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-white text-white group-hover:bg-white/10 transition-colors">
            <PlayCircle className="h-4 w-4" />
          </span>
        </span>
      </div>
      {/* Fixed 1-line title + 2-line description so every tile in the grid
          lines up, no matter how short or long the actual text is. */}
      <p className="mt-1.5 min-h-4 text-xs text-navy-800 font-medium truncate">{title}</p>
      <p className="mt-0.5 min-h-8 text-xs text-slate-500 line-clamp-2">{description}</p>
    </button>
  );
}
