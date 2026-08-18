import { cookies } from "next/headers";
import crypto from "node:crypto";
import { findUserByUsername, findUserById, verifyPassword, type CotizadorUser, type UserRole } from "./users";

// Hardcoded per request ("login quemado"). Never sent to the client — only used to sign the session cookie.
const SESSION_SECRET = "st-cotizador-9f21b6d4e8a7-secret";
const COOKIE_NAME = "cotizador_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  userId: string;
  username: string;
  role: UserRole;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function encodeSession(payload: SessionPayload): string {
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${json}.${sign(json)}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [json, sig] = token.split(".");
  if (!json || !sig || sign(json) !== sig) return null;
  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

export async function checkCredentials(
  username: string,
  password: string
): Promise<CotizadorUser | null> {
  const user = await findUserByUsername(username);
  if (!user || user.disabled) return null;
  return verifyPassword(password, user.salt, user.passwordHash) ? user : null;
}

export async function createSession(user: CotizadorUser) {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession({ userId: user.id, username: user.username, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const payload = token ? decodeSession(token) : null;
  if (!payload) return null;

  // Re-check against the live user record so a disabled account loses access
  // immediately, even if it still holds a validly-signed cookie.
  const user = await findUserById(payload.userId);
  if (!user || user.disabled) return null;

  return payload;
}

export async function hasValidSession(): Promise<boolean> {
  return (await getSession()) !== null;
}
