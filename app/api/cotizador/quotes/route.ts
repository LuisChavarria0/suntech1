import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { appendQuoteLog, listQuoteLog } from "@/lib/cotizador/quotesLog";

// Read is available to any logged-in admin (editor or super_admin) — this is a
// business record, not a sensitive config change. ?year=YYYY&month=MM filter
// which month file(s) get read; with neither, the most recent month wins.
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const year = url.searchParams.get("year") ?? undefined;
  const month = url.searchParams.get("month") ?? undefined;

  const { entries, availableMonths } = await listQuoteLog({ year, month });
  return NextResponse.json({ entries, availableMonths });
}

// Write is public: it's called from the public quote calculator when a visitor
// sends their quote, no login involved.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    typeof body.systemType !== "string" ||
    typeof body.name !== "string" ||
    typeof body.address !== "string" ||
    typeof body.phone !== "string" ||
    !body.name.trim() ||
    !body.address.trim() ||
    !body.phone.trim()
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const kw = typeof body.kw === "number" && Number.isFinite(body.kw) ? body.kw : null;

  try {
    await appendQuoteLog({
      systemType: body.systemType.trim().slice(0, 200),
      kw,
      name: body.name.trim().slice(0, 200),
      address: body.address.trim().slice(0, 300),
      phone: body.phone.trim().slice(0, 50),
    });
  } catch (err) {
    console.error("Failed to persist quote log", err);
    return NextResponse.json({ error: "No se pudo guardar el registro." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
