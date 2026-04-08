import type { AuthSession, AuthUser, AuthUserId, LoginCredentials } from "@/lib/types";

type StoredUserRecord = AuthUser & {
  passwordHash: string;
};

export const AUTH_STORAGE_KEY = "limbi.auth.session";

const STORED_USERS: StoredUserRecord[] = [
  {
    id: "user1",
    username: "user1",
    passwordHash: "54794102c841128422ed01916433b3010a8bd437415393a0b22964fcd60ed77b"
  },
  {
    id: "user2",
    username: "user2",
    passwordHash: "a38bbb05a8d7888235567645bcc1447f1d56ca3b1cb2fe201d9a02a3a7487dcb"
  }
];

export const PREDEFINED_USERS: AuthUser[] = STORED_USERS.map(({ passwordHash: _passwordHash, ...user }) => user);

export async function hashPassword(password: string) {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("Web Crypto API недоступен");
  }

  const normalized = password.normalize("NFKC").trim();
  const bytes = new TextEncoder().encode(normalized);
  const hashBuffer = await subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function findUserByUsername(username: string) {
  const normalized = normalizeUsername(username);

  return STORED_USERS.find((user) => user.username === normalized) ?? null;
}

export function toPublicUser(user: Pick<StoredUserRecord, "id" | "username">): AuthUser {
  return {
    id: user.id,
    username: user.username
  };
}

export function isAuthUserId(value: unknown): value is AuthUserId {
  return value === "user1" || value === "user2";
}

export function parseStoredSession(raw: string | null): AuthSession | null {
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as Partial<AuthSession>;

    if (!isAuthUserId(session.userId) || typeof session.authenticatedAt !== "string") {
      return null;
    }

    return {
      userId: session.userId,
      authenticatedAt: session.authenticatedAt
    };
  } catch {
    return null;
  }
}

export function buildSession(userId: AuthUserId): AuthSession {
  return {
    userId,
    authenticatedAt: new Date().toISOString()
  };
}

export function readSessionFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredSession(window.localStorage.getItem(AUTH_STORAGE_KEY));
}

export function writeSessionToStorage(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getUserById(userId: AuthUserId) {
  const user = STORED_USERS.find((item) => item.id === userId);

  return user ? toPublicUser(user) : null;
}

export async function validateCredentials(credentials: LoginCredentials) {
  const user = findUserByUsername(credentials.username);

  if (!user) {
    return null;
  }

  const passwordHash = await hashPassword(credentials.password);

  if (passwordHash !== user.passwordHash) {
    return null;
  }

  return toPublicUser(user);
}

export function getAlternativeUserId(userId: AuthUserId): AuthUserId {
  return userId === "user1" ? "user2" : "user1";
}

export function sanitizeNextPath(nextPath: string | null | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//") || nextPath.startsWith("/login")) {
    return "/";
  }

  return nextPath;
}
