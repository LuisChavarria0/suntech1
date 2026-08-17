"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function YouTubePlayer({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-9/16 w-full max-w-56 mx-auto rounded-xl overflow-hidden bg-navy-950">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Video"
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Reproducir video"
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-950/30" />
          <span className="relative flex items-center justify-center h-14 w-14 rounded-full border-2 border-white text-white group-hover:bg-white/10 transition-colors">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}
