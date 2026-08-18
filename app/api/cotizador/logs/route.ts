import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { listAuditLog } from "@/lib/cotizador/auditLog";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const entries = await listAuditLog();
  return NextResponse.json(entries);
}
