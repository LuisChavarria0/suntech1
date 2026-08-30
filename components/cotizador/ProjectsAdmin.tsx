"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECT_CATEGORIES, type ProjectRecord } from "@/lib/data/projectTypes";
import type { SessionPayload } from "@/lib/cotizador/auth";

const MAX_GALLERY = 3;

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";
const areaClass =
  "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";

const CATEGORY_LABEL: Record<string, string> = {
  solar: "Energía Solar",
  seguridad: "Seguridad",
  tecnologia: "Tecnología",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyProject(): ProjectRecord {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
    slug: "",
    category: "solar",
    location: "",
    year: new Date().getFullYear(),
    featured: false,
    image: "",
    gallery: [],
    title: { es: "", en: "" },
    description: { es: "", en: "" },
  };
}

const isUpload = (p: string) => /^\/uploads\/proyectos\/[a-z0-9-]+\.webp$/.test(p);

function collectUploads(list: ProjectRecord[]): Set<string> {
  const set = new Set<string>();
  for (const p of list) {
    if (isUpload(p.image)) set.add(p.image);
    for (const g of p.gallery) if (isUpload(g)) set.add(g);
  }
  return set;
}

export function ProjectsAdmin({
  initialProjects,
  max,
  session,
}: {
  initialProjects: ProjectRecord[];
  max: number;
  session: SessionPayload;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ draft: ProjectRecord; isNew: boolean } | null>(null);
  const savedRef = useRef<ProjectRecord[]>(initialProjects);

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const openNew = () => {
    if (projects.length >= max) return;
    setEditing({ draft: emptyProject(), isNew: true });
  };
  const openEdit = (p: ProjectRecord) => {
    setEditing({ draft: JSON.parse(JSON.stringify(p)), isNew: false });
  };

  const applyDraft = (draft: ProjectRecord) => {
    setProjects((prev) =>
      editing?.isNew ? [...prev, draft] : prev.map((p) => (p.id === draft.id ? draft : p))
    );
    setEditing(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);

    const payload = projects.map((p) => ({
      ...p,
      slug: p.slug.trim() || slugify(p.title.es || p.title.en),
      gallery: p.gallery.filter((g) => g.trim() !== "").slice(0, MAX_GALLERY),
    }));

    const res = await fetch("/api/cotizador/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: payload }),
    });
    setSaving(false);

    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      setMessage(detail?.error ? `No se pudo guardar: ${detail.error}` : "No se pudo guardar.");
      return;
    }

    // Delete upload files that are no longer referenced anywhere.
    const before = collectUploads(savedRef.current);
    const after = collectUploads(payload);
    for (const path of before) {
      if (!after.has(path)) {
        fetch(`/api/cotizador/upload?path=${encodeURIComponent(path)}`, {
          method: "DELETE",
        }).catch(() => {});
      }
    }

    setProjects(payload);
    savedRef.current = payload;
    setMessage("Cambios guardados.");
    router.refresh();
  };

  const logout = async () => {
    await fetch("/api/cotizador/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Proyectos — Administración</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sesión: <span className="font-semibold text-navy-800">{session.username}</span> ·{" "}
            {projects.length} / {max} proyectos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cotizador"
            className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors"
          >
            Cotizador
          </Link>
          <button
            onClick={logout}
            className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center gap-3 mb-6 bg-slate-50/90 backdrop-blur py-2 rounded-xl">
        <button
          onClick={openNew}
          disabled={projects.length >= max}
          className="h-11 px-6 bg-white border border-navy-200 hover:bg-navy-50 disabled:opacity-50 text-navy-800 text-sm font-bold rounded-xl transition-colors cursor-pointer"
        >
          + Agregar proyecto{projects.length >= max ? ` (máximo ${max})` : ""}
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

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p, i) => (
          <div key={p.id} className="card-base p-3 flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-navy-900 text-sm truncate">
                {p.title.es || p.title.en || `Proyecto ${i + 1}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {CATEGORY_LABEL[p.category]} · {p.location || "sin ubicación"} · {p.year}
                {p.featured ? " · ⭐ portada" : ""}
              </p>
            </div>
            <button
              onClick={() => openEdit(p)}
              className="h-9 px-4 rounded-lg border border-navy-200 hover:bg-navy-50 text-navy-800 text-xs font-bold cursor-pointer"
            >
              Editar
            </button>
            <button
              onClick={() => removeProject(p.id)}
              className="h-9 px-4 rounded-lg text-red-500 hover:bg-red-50 text-xs font-bold cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-slate-400 py-8 text-center">No hay proyectos todavía.</p>
        )}
      </div>

      {editing && (
        <ProjectModal
          draft={editing.draft}
          isNew={editing.isNew}
          onCancel={() => setEditing(null)}
          onApply={applyDraft}
        />
      )}
    </div>
  );
}

function ProjectModal({
  draft: initial,
  isNew,
  onCancel,
  onApply,
}: {
  draft: ProjectRecord;
  isNew: boolean;
  onCancel: () => void;
  onApply: (draft: ProjectRecord) => void;
}) {
  const [draft, setDraft] = useState<ProjectRecord>(initial);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  const set = (patch: Partial<ProjectRecord>) => setDraft((d) => ({ ...d, ...patch }));
  const setT = (locale: "es" | "en", v: string) =>
    setDraft((d) => ({ ...d, title: { ...d.title, [locale]: v } }));
  const setD = (locale: "es" | "en", v: string) =>
    setDraft((d) => ({ ...d, description: { ...d.description, [locale]: v } }));

  const galleryLeft = MAX_GALLERY - draft.gallery.length;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-navy-950/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <section
        className="card-base w-full max-w-2xl my-6 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-navy-900">
            {isNew ? "Nuevo proyecto" : "Editar proyecto"}
          </h2>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-navy-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Título (Español)">
            <input value={draft.title.es} onChange={(e) => setT("es", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Título (English)">
            <input value={draft.title.en} onChange={(e) => setT("en", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Descripción (Español)">
            <textarea rows={3} value={draft.description.es} onChange={(e) => setD("es", e.target.value)} className={areaClass} />
          </Field>
          <Field label="Descripción (English)">
            <textarea rows={3} value={draft.description.en} onChange={(e) => setD("en", e.target.value)} className={areaClass} />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={draft.slug}
              onChange={(e) => set({ slug: e.target.value })}
              placeholder="se genera del título si se deja vacío"
              className={inputClass}
            />
          </Field>
          <Field label="Categoría">
            <select
              value={draft.category}
              onChange={(e) => set({ category: e.target.value as ProjectRecord["category"] })}
              className={inputClass}
            >
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ubicación">
            <input value={draft.location} onChange={(e) => set({ location: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Año">
            <input
              type="number"
              value={draft.year}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => set({ year: parseInt(e.target.value, 10) || draft.year })}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-navy-900 mt-4">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => set({ featured: e.target.checked })}
            className="h-4 w-4"
          />
          Destacado (portada)
        </label>

        {/* Main image */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Imagen principal
          </p>
          {draft.image ? (
            <ImageThumb src={draft.image} onRemove={() => set({ image: "" })} big />
          ) : (
            <UploadButton label="Subir imagen" onUploaded={(paths) => set({ image: paths[0] })} />
          )}
        </div>

        {/* Gallery */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Galería ({draft.gallery.length}/{MAX_GALLERY})
          </p>
          {draft.gallery.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {draft.gallery.map((g, idx) => (
                <ImageThumb
                  key={g + idx}
                  src={g}
                  onRemove={() =>
                    set({ gallery: draft.gallery.filter((_, i) => i !== idx) })
                  }
                />
              ))}
            </div>
          )}
          {galleryLeft > 0 ? (
            <UploadButton
              label={`Subir a la galería (máx. ${galleryLeft} más)`}
              multiple
              max={galleryLeft}
              onUploaded={(paths) =>
                set({ gallery: [...draft.gallery, ...paths].slice(0, MAX_GALLERY) })
              }
            />
          ) : (
            <p className="text-xs text-slate-400">Máximo {MAX_GALLERY} imágenes.</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => onApply(draft)}
            className="h-11 px-6 bg-navy-800 hover:bg-navy-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isNew ? "Agregar" : "Aplicar"}
          </button>
          <button
            onClick={onCancel}
            className="h-11 px-6 text-slate-500 hover:text-navy-900 text-sm font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <span className="text-xs text-slate-400">
            Recuerda pulsar “Guardar cambios” para publicar.
          </span>
        </div>
      </section>
    </div>
  );
}

function ImageThumb({
  src,
  onRemove,
  big,
}: {
  src: string;
  onRemove: () => void;
  big?: boolean;
}) {
  return (
    <div className={`relative ${big ? "w-48" : "w-28"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`w-full ${big ? "h-32" : "h-24"} object-cover rounded-lg border border-slate-200`}
      />
      <button
        onClick={onRemove}
        aria-label="Eliminar imagen"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

function UploadButton({
  label,
  multiple,
  max,
  onUploaded,
}: {
  label: string;
  multiple?: boolean;
  max?: number;
  onUploaded: (paths: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files).slice(0, max ?? files.length);
    setBusy(true);
    setError(null);
    const paths: string[] = [];
    try {
      for (const file of picked) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/cotizador/upload", { method: "POST", body });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? "Error al subir");
        paths.push(data.path);
      }
      onUploaded(paths);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-navy-200 bg-white hover:bg-navy-50 text-xs font-semibold text-navy-800 cursor-pointer transition-colors">
        {busy ? "Subiendo..." : label}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={busy}
          onChange={(e) => {
            handle(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
      <span className="ml-2 text-xs text-slate-400">se convierte a WebP y se reduce a 1600px</span>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
