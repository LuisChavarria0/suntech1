import { NextResponse } from "next/server";
import { readCotizadorConfig, writeCotizadorConfig, type CotizadorConfig } from "@/lib/cotizador/config";
import { getSession } from "@/lib/cotizador/auth";
import { diffConfig } from "@/lib/cotizador/diffConfig";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function GET() {
  const config = await readCotizadorConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as CotizadorConfig;

  if (
    !body ||
    typeof body !== "object" ||
    !body.formula ||
    !Array.isArray(body.inverterTiers) ||
    !Array.isArray(body.products)
  ) {
    return NextResponse.json({ error: "Configuración inválida" }, { status: 400 });
  }

  try {
    const previousConfig = await readCotizadorConfig();
    await writeCotizadorConfig(body);

    const changes = diffConfig(previousConfig, body);
    if (changes.length > 0) {
      await appendAuditLog({
        username: session.username,
        action: "update_config",
        details: changes.join("; "),
      });
    }
  } catch (err) {
    console.error("Failed to persist cotizador config", err);
    return NextResponse.json(
      { error: "No se pudo escribir la configuración en el servidor." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
