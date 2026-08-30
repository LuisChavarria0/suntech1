import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { changePassword } from "@/lib/cotizador/users";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    await changePassword(session.userId, currentPassword, newPassword);

    await appendAuditLog({
      username: session.username,
      action: "change_password",
      details: "Cambió su contraseña",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "BAD_CURRENT_PASSWORD") {
      return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
    }
    if (message === "PASSWORD_TOO_SHORT") {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }
    console.error("Failed to change password", err);
    return NextResponse.json({ error: "No se pudo cambiar la contraseña" }, { status: 500 });
  }
}
