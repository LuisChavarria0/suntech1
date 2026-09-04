"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Trash2, PlayCircle, Pencil } from "lucide-react";
import type { SessionPayload } from "@/lib/cotizador/auth";
import {
  makeTestimonialVideo,
  parseVideoUrl,
  thumbnailFor,
  MAX_TESTIMONIAL_VIDEOS,
  type TestimonialVideo,
} from "@/lib/data/testimonialVideoUtils";
import { AdminShell } from "./AdminShell";

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";
const areaClass =
  "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all resize-none";

// Keeps every description short enough to fit two lines wherever it's shown —
// no manual line breaks (so it wraps naturally, not as a forced paragraph)
// and capped in length so long text can't overflow the two-line layout.
const DESCRIPTION_MAX_LENGTH = 140;
const blockNewline = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter") e.preventDefault();
};

export function TestimonialVideosAdmin({
  initialVideos,
  session,
}: {
  initialVideos: TestimonialVideo[];
  session: SessionPayload;
}) {
  const router = useRouter();
  const [videos, setVideos] = useState<TestimonialVideo[]>(initialVideos);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<TestimonialVideo | null>(null);

  const atMax = videos.length >= MAX_TESTIMONIAL_VIDEOS;

  const addVideo = (video: TestimonialVideo): string | null => {
    if (videos.some((v) => v.provider === video.provider && v.embedId === video.embedId)) {
      return "Ese video ya está en la lista.";
    }
    // New videos go to the front — "últimos agregados primero".
    setVideos((prev) => [video, ...prev]);
    setAdding(false);
    return null;
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const reorder = (from: number, to: number) => {
    setVideos((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const applyEdit = (updated: TestimonialVideo): string | null => {
    if (
      videos.some(
        (v) => v.id !== updated.id && v.provider === updated.provider && v.embedId === updated.embedId
      )
    ) {
      return "Ese video ya está en la lista.";
    }
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setEditing(null);
    return null;
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/cotizador/testimonial-videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videos }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Cambios guardados.");
      router.refresh();
      return;
    }
    const detail = await res.json().catch(() => null);
    setMessage(detail?.error ? `No se pudo guardar: ${detail.error}` : "No se pudo guardar.");
  };

  return (
    <AdminShell session={session} maxWidth="4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900">Videos de testimonios</h1>
        <p className="text-xs text-slate-500 mt-1">
          {videos.length} / {MAX_TESTIMONIAL_VIDEOS} videos — se muestran en este orden en &ldquo;Ver
          más testimonios&rdquo;.
        </p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center gap-3 mb-6 bg-slate-50/90 backdrop-blur py-2 rounded-xl">
        <button
          onClick={() => setAdding(true)}
          disabled={atMax}
          className="h-11 px-6 bg-white border border-navy-200 hover:bg-navy-50 disabled:opacity-50 text-navy-800 text-sm font-bold rounded-xl transition-colors cursor-pointer"
        >
          + Agregar video{atMax ? ` (máximo ${MAX_TESTIMONIAL_VIDEOS})` : ""}
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="h-11 px-6 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>

      {/* List, drag to reorder */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-1">Lista</h2>
        <p className="text-xs text-slate-500 mb-4">Arrastra por el ícono para reordenar.</p>

        {videos.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">Todavía no hay videos.</p>
        ) : (
          <div className="space-y-2">
            {videos.map((video, i) => {
              const thumb = thumbnailFor(video);
              return (
                <div
                  key={video.id}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 bg-white transition-opacity ${
                    dragIndex === i ? "opacity-40" : ""
                  }`}
                >
                  <span className="shrink-0 text-slate-400 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </span>
                  <div className="relative h-12 w-20 shrink-0 rounded-lg overflow-hidden bg-navy-900 flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <PlayCircle className="h-6 w-6 text-white/70" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-navy-800 uppercase tracking-wide">
                      {video.provider === "youtube" ? "YouTube" : "Vimeo"}
                    </p>
                    <p className="text-sm text-navy-900 truncate">
                      {video.title.es || video.title.en || (
                        <span className="text-slate-400 font-normal">Sin título</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 min-h-8">
                      {video.description.es || video.description.en || (
                        <span className="text-slate-300">Sin descripción</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{video.url}</p>
                  </div>
                  <button
                    onClick={() => setEditing(video)}
                    aria-label="Editar video"
                    className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg text-navy-700 hover:bg-navy-50 transition-colors cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeVideo(video.id)}
                    aria-label="Eliminar video"
                    className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {adding && <TestimonialVideoAddModal onCancel={() => setAdding(false)} onAdd={addVideo} />}

      {editing && (
        <TestimonialVideoEditModal
          video={editing}
          onCancel={() => setEditing(null)}
          onApply={applyEdit}
        />
      )}
    </AdminShell>
  );
}

function TestimonialVideoAddModal({
  onCancel,
  onAdd,
}: {
  onCancel: () => void;
  onAdd: (video: TestimonialVideo) => string | null;
}) {
  const [url, setUrl] = useState("");
  const [titleEs, setTitleEs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descEs, setDescEs] = useState("");
  const [descEn, setDescEn] = useState("");
  const [error, setError] = useState<string | null>(null);

  const textComplete = titleEs.trim() && titleEn.trim() && descEs.trim() && descEn.trim();

  const submit = () => {
    setError(null);
    if (!textComplete) {
      setError("Título y descripción son obligatorios, en español y en inglés.");
      return;
    }
    const video = makeTestimonialVideo(url, {
      title: { es: titleEs.trim(), en: titleEn.trim() },
      description: { es: descEs.trim(), en: descEn.trim() },
    });
    if (!video) {
      setError("No pude reconocer esa URL. Pega un enlace de YouTube o Vimeo.");
      return;
    }
    const dupeError = onAdd(video);
    if (dupeError) setError(dupeError);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <section
        className="card-base p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900">Agregar video</h2>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-navy-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Pega el enlace de YouTube o Vimeo. Título y descripción son obligatorios (ES y EN). Se
          agrega arriba de todo.
        </p>

        <div className="space-y-4">
          <Field label="URL del video">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Título (ES)">
              <input value={titleEs} onChange={(e) => setTitleEs(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Título (EN)">
              <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Descripción (ES)">
              <textarea
                rows={2}
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={descEs}
                onChange={(e) => setDescEs(e.target.value)}
                onKeyDown={blockNewline}
                className={areaClass}
              />
            </Field>
            <Field label="Descripción (EN)">
              <textarea
                rows={2}
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                onKeyDown={blockNewline}
                className={areaClass}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={submit}
            disabled={!url.trim() || !textComplete}
            className="h-11 px-6 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </section>
    </div>
  );
}

function TestimonialVideoEditModal({
  video,
  onCancel,
  onApply,
}: {
  video: TestimonialVideo;
  onCancel: () => void;
  onApply: (video: TestimonialVideo) => string | null;
}) {
  const [draft, setDraft] = useState<TestimonialVideo>(video);
  const [url, setUrl] = useState(video.url);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      setError("No pude reconocer esa URL. Pega un enlace de YouTube o Vimeo.");
      return;
    }
    const dupeError = onApply({
      ...draft,
      url: url.trim(),
      provider: parsed.provider,
      embedId: parsed.embedId,
      isVertical: parsed.isVertical,
    });
    if (dupeError) setError(dupeError);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <section
        className="card-base p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900">Editar video</h2>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-navy-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-4">
          <Field label="URL del video">
            <input value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Título (ES)">
              <input
                value={draft.title.es}
                onChange={(e) => setDraft({ ...draft, title: { ...draft.title, es: e.target.value } })}
                className={inputClass}
              />
            </Field>
            <Field label="Título (EN)">
              <input
                value={draft.title.en}
                onChange={(e) => setDraft({ ...draft, title: { ...draft.title, en: e.target.value } })}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Descripción (ES)">
              <textarea
                rows={2}
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={draft.description.es}
                onChange={(e) =>
                  setDraft({ ...draft, description: { ...draft.description, es: e.target.value } })
                }
                onKeyDown={blockNewline}
                className={areaClass}
              />
            </Field>
            <Field label="Descripción (EN)">
              <textarea
                rows={2}
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={draft.description.en}
                onChange={(e) =>
                  setDraft({ ...draft, description: { ...draft.description, en: e.target.value } })
                }
                onKeyDown={blockNewline}
                className={areaClass}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={submit}
            disabled={!url.trim()}
            className="h-11 px-6 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
