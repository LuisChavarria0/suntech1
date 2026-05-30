import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 hero-gradient flex flex-col items-center justify-center px-4 text-center">
      {/* 404 */}
      <div className="text-[160px] md:text-[220px] font-extrabold leading-none text-white/5 select-none absolute">
        404
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
          Página no encontrada
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Esta página no{" "}
          <span className="gradient-text-gold">existe</span>
        </h1>
        <p className="text-navy-300 text-lg mb-10 max-w-md">
          Es posible que el enlace esté roto o que la página haya sido movida.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-7 bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-bold rounded-xl transition-colors shadow-md"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 h-12 px-7 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Contactarnos
          </Link>
        </div>
      </div>
    </div>
  );
}
