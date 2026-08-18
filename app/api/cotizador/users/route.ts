import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import { createUser, listUsers } from "@/lib/cotizador/users";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    const user = await createUser({
      username,
      password,
      role: "editor",
      createdBy: session.username,
    });

    await appendAuditLog({
      username: session.username,
      action: "create_user",
      details: `Creó el usuario "${user.username}" (editor)`,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "Ese usuario ya existe" }, { status: 409 });
    }
    if (message === "PASSWORD_TOO_SHORT") {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
