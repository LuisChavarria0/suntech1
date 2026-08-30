import crypto from "node:crypto";
import { readJson, writeJson } from "./jsonStore";

export type UserRole = "super_admin" | "editor";

export interface CotizadorUser {
  id: string;
  username: string;
  salt: string;
  passwordHash: string;
  role: UserRole;
  disabled: boolean;
  createdAt: string;
  createdBy: string | null;
}

export type PublicUser = Omit<CotizadorUser, "salt" | "passwordHash">;

const KEY = "cotizador-users";
const FILE = "cotizador-users.json";

interface UsersFile {
  users: CotizadorUser[];
}

async function readUsersFile(): Promise<UsersFile> {
  const data = await readJson<UsersFile>(KEY, FILE, { users: [] });
  data.users = (data.users ?? []).map((u) => ({ ...u, disabled: u.disabled ?? false }));
  return data;
}

async function writeUsersFile(data: UsersFile): Promise<void> {
  await writeJson(KEY, FILE, data);
}

function hashPassword(password: string, salt: string = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const candidate = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return crypto.timingSafeEqual(candidate, stored);
}

export async function findUserByUsername(username: string): Promise<CotizadorUser | null> {
  const { users } = await readUsersFile();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<CotizadorUser | null> {
  const { users } = await readUsersFile();
  return users.find((u) => u.id === id) ?? null;
}

function toPublicUser({ salt: _salt, passwordHash: _passwordHash, ...rest }: CotizadorUser): PublicUser {
  return rest;
}

export async function listUsers(): Promise<PublicUser[]> {
  const { users } = await readUsersFile();
  return users.map(toPublicUser);
}

export async function createUser(input: {
  username: string;
  password: string;
  role: UserRole;
  createdBy: string;
}): Promise<PublicUser> {
  const data = await readUsersFile();

  const username = input.username.trim();
  if (!username || !input.password) {
    throw new Error("INVALID_INPUT");
  }
  if (input.password.length < 8) {
    throw new Error("PASSWORD_TOO_SHORT");
  }
  if (data.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("USERNAME_TAKEN");
  }

  const { salt, hash } = hashPassword(input.password);
  const user: CotizadorUser = {
    id: crypto.randomUUID(),
    username,
    salt,
    passwordHash: hash,
    role: input.role,
    disabled: false,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };

  data.users.push(user);
  await writeUsersFile(data);

  return toPublicUser(user);
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const data = await readUsersFile();
  const user = data.users.find((u) => u.id === id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  if (!verifyPassword(currentPassword, user.salt, user.passwordHash)) {
    throw new Error("BAD_CURRENT_PASSWORD");
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const { salt, hash } = hashPassword(newPassword);
  user.salt = salt;
  user.passwordHash = hash;
  await writeUsersFile(data);
}

export async function setUserDisabled(id: string, disabled: boolean): Promise<PublicUser> {
  const data = await readUsersFile();
  const user = data.users.find((u) => u.id === id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  user.disabled = disabled;
  await writeUsersFile(data);
  return toPublicUser(user);
}
