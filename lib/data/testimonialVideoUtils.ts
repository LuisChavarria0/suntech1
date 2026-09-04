// Client-safe helpers — no node built-ins here, this file gets bundled for
// the browser (video card thumbnails/embeds in the modal, URL parsing in the
// admin form). Server-only reads/writes live in testimonialVideos.ts.

import type { Locale, LocalizedText } from "./projectTypes";

export type VideoProvider = "youtube" | "vimeo";

export interface TestimonialVideo {
  id: string;
  url: string;
  provider: VideoProvider;
  embedId: string;
  /** YouTube Shorts (and any other vertical source) play in a tall 9:16 frame
   * in the expanded view instead of the usual 16:9. */
  isVertical: boolean;
  title: LocalizedText;
  description: LocalizedText;
  addedAt: string;
}

const EMPTY_TEXT: LocalizedText = { es: "", en: "" };

export function normalizeTestimonialVideo(video: TestimonialVideo): TestimonialVideo {
  return {
    ...video,
    title: { es: video.title?.es ?? "", en: video.title?.en ?? "" },
    description: { es: video.description?.es ?? "", en: video.description?.en ?? "" },
  };
}

export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.es || text.en || "";
}

export const MAX_TESTIMONIAL_VIDEOS = 30;

/** Pulls a YouTube/Vimeo video id out of any of the URL shapes people paste. */
export function parseVideoUrl(
  raw: string
): { provider: VideoProvider; embedId: string; isVertical: boolean } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? { provider: "youtube", embedId: id, isVertical: false } : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? { provider: "youtube", embedId: id, isVertical: false } : null;
    }
    const m = url.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
    if (m) return { provider: "youtube", embedId: m[2], isVertical: m[1] === "shorts" };
    return null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = url.pathname.match(/(\d+)(?!.*\d)/);
    return m ? { provider: "vimeo", embedId: m[1], isVertical: false } : null;
  }

  return null;
}

export function makeTestimonialVideo(
  url: string,
  text?: { title: LocalizedText; description: LocalizedText }
): TestimonialVideo | null {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;
  return {
    id: crypto.randomUUID(),
    url: url.trim(),
    provider: parsed.provider,
    embedId: parsed.embedId,
    isVertical: parsed.isVertical,
    title: text ? { ...text.title } : { ...EMPTY_TEXT },
    description: text ? { ...text.description } : { ...EMPTY_TEXT },
    addedAt: new Date().toISOString(),
  };
}

export function embedSrcFor(video: Pick<TestimonialVideo, "provider" | "embedId">): string {
  return video.provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${video.embedId}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${video.embedId}?autoplay=1`;
}

export function thumbnailFor(video: Pick<TestimonialVideo, "provider" | "embedId">): string | null {
  // YouTube serves thumbnails with no auth needed. Vimeo's equivalent requires
  // an oEmbed round-trip, which isn't worth it for a "nice to have" thumbnail —
  // Vimeo cards fall back to a plain placeholder in the UI.
  return video.provider === "youtube"
    ? `https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`
    : null;
}
