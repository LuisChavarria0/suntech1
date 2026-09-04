import { readJson, writeJson } from "@/lib/cotizador/jsonStore";
import {
  MAX_TESTIMONIAL_VIDEOS,
  normalizeTestimonialVideo,
  type TestimonialVideo,
} from "./testimonialVideoUtils";

export {
  MAX_TESTIMONIAL_VIDEOS,
  parseVideoUrl,
  makeTestimonialVideo,
  embedSrcFor,
  thumbnailFor,
  pickText,
} from "./testimonialVideoUtils";
export type { VideoProvider, TestimonialVideo } from "./testimonialVideoUtils";

const KEY = "testimonial-videos";
const FILE = "testimonial-videos.json";

interface VideosFile {
  videos: TestimonialVideo[];
}

export async function readTestimonialVideos(): Promise<TestimonialVideo[]> {
  const data = await readJson<VideosFile>(KEY, FILE, { videos: [] });
  return (data.videos ?? []).map(normalizeTestimonialVideo);
}

export async function writeTestimonialVideos(videos: TestimonialVideo[]): Promise<void> {
  await writeJson(KEY, FILE, {
    videos: videos.slice(0, MAX_TESTIMONIAL_VIDEOS).map(normalizeTestimonialVideo),
  });
}
