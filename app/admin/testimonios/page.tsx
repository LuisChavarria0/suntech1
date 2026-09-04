import { redirect } from "next/navigation";
import { getSession } from "@/lib/cotizador/auth";
import { readTestimonialVideos } from "@/lib/data/testimonialVideos";
import { TestimonialVideosAdmin } from "@/components/cotizador/TestimonialVideosAdmin";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const videos = await readTestimonialVideos();

  return <TestimonialVideosAdmin initialVideos={videos} session={session} />;
}
