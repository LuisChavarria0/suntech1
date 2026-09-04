"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data/company";
import type { SessionPayload } from "@/lib/cotizador/auth";
import { ChangePasswordModal } from "./ChangePasswordModal";

const NAV_LINKS = [
  { href: "/admin/cotizador", label: "Cotizador", superAdminOnly: false },
  { href: "/admin/cotizaciones", label: "Cotizaciones", superAdminOnly: false },
  { href: "/admin/proyectos", label: "Proyectos", superAdminOnly: false },
  { href: "/admin/testimonios", label: "Testimonios", superAdminOnly: false },
  { href: "/admin/usuarios", label: "Usuarios y registro", superAdminOnly: true },
] as const;

const MAX_WIDTH_CLASS = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
} as const;

export function AdminShell({
  session,
  maxWidth = "4xl",
  children,
}: {
  session: SessionPayload;
  maxWidth?: keyof typeof MAX_WIDTH_CLASS;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const links = NAV_LINKS.filter((l) => !l.superAdminOnly || session.role === "super_admin");

  const logout = async () => {
    await fetch("/api/cotizador/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-navy-100">
        <div className="container-tight">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6 min-w-0">
              <Link href="/admin/cotizador" className="shrink-0">
                <Image
                  src={COMPANY_INFO.logoUrl}
                  alt="Grupo Suntech"
                  width={560}
                  height={168}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {links.map((link) => {
                  const active = pathname?.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-navy-800 text-white"
                          : "text-navy-700 hover:text-navy-950 hover:bg-navy-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <p className="text-sm font-semibold text-navy-900">{session.username}</p>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors cursor-pointer"
              >
                Cambiar contraseña
              </button>
              <button
                onClick={logout}
                className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-navy-900 rounded-lg hover:bg-navy-50 transition-colors"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-navy-100 bg-white">
            <div className="container-tight py-3 flex flex-col gap-1">
              {links.map((link) => {
                const active = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                      active ? "bg-navy-800 text-white" : "text-navy-700 hover:bg-navy-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-navy-900">{session.username}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setShowPasswordForm(true);
                    }}
                    className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors cursor-pointer"
                  >
                    Contraseña
                  </button>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {showPasswordForm && (
        <ChangePasswordModal onClose={() => setShowPasswordForm(false)} />
      )}

      <div className={`container-tight ${MAX_WIDTH_CLASS[maxWidth]} py-10`}>{children}</div>
    </div>
  );
}
