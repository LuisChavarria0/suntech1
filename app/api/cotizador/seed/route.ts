import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { hasBlob } from "@/lib/cotizador/blobStore";
import { readCotizadorConfig } from "@/lib/cotizador/config";
import { listUsers } from "@/lib/cotizador/users";
import { listAuditLog } from "@/lib/cotizador/auditLog";
import { readProjectRecords } from "@/lib/data/projectsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Touches every data file so the Blob store gets seeded (or re-seeded from the
// committed files if they changed). Safe to call any time.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [config, users, logs, projects] = await Promise.all([
    readCotizadorConfig(),
    listUsers(),
    listAuditLog(),
    readProjectRecords(),
  ]);

  return NextResponse.json({
    blobEnabled: hasBlob(),
    seeded: {
      "cotizador-config": config.products.length + " productos",
      "cotizador-users": users.length + " usuarios",
      "cotizador-audit-log": logs.length + " entradas",
      projects: projects.length + " proyectos",
    },
  });
}
