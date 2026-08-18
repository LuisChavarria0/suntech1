import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { findUserById, setUserDisabled } from "@/lib/cotizador/users";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { disabled } = await request.json();
  if (typeof disabled !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  if (id === session.userId) {
    return NextResponse.json({ error: "No puedes inhabilitar tu propia cuenta" }, { status: 400 });
  }

  const target = await findUserById(id);
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const user = await setUserDisabled(id, disabled);

  await appendAuditLog({
    username: session.username,
    action: disabled ? "disable_user" : "enable_user",
    details: `${disabled ? "Inhabilitó" : "Habilitó"} el usuario "${user.username}"`,
  });

  return NextResponse.json(user);
}
