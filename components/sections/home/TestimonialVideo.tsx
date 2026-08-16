"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function TestimonialVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-navy-950">
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        playsInline
        className="fullscreen-contain block w-full h-auto"
      />

      {!playing && (
        <button
          onClick={handlePlay}
          aria-label="Reproducir video"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-white text-white group-hover:bg-white/10 transition-colors">
            <Play className="h-6 w-6 fill-white ml-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}
