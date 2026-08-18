import { NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/cotizador/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const user = await checkCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(user);
  return NextResponse.json({ ok: true, role: user.role });
}
