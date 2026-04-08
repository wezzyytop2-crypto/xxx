"use client";

import { useSyncExternalStore } from "react";
import {
  buildSession,
  getUserById,
  readSessionFromStorage,
  sanitizeNextPath,
  validateCredentials,
  writeSessionToStorage
} from "@/lib/auth";
import type { AuthUser, LoginCredentials, LoginResult } from "@/lib/types";

type AuthStoreState = {
  ready: boolean;
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
  hydrateSession: () => void;
  resolveNextPath: (nextPath: string | null | undefined) => string;
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function setState(patch: Partial<AuthStoreState>) {
  state = {
    ...state,
    ...patch
  };
  emitChange();
}

async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const user = await validateCredentials(credentials);

  if (!user) {
    return {
      success: false,
      error: "Неверный логин или пароль."
    };
  }

  writeSessionToStorage(buildSession(user.id));
  setState({
    ready: true,
    user
  });

  return {
    success: true,
    user
  };
}

function logout() {
  writeSessionToStorage(null);
  setState({
    ready: true,
    user: null
  });
}

function hydrateSession() {
  const session = readSessionFromStorage();
  const user = session ? getUserById(session.userId) : null;

  if (!user && session) {
    writeSessionToStorage(null);
  }

  setState({
    ready: true,
    user
  });
}

function resolveNextPath(nextPath: string | null | undefined) {
  return sanitizeNextPath(nextPath);
}

let state: AuthStoreState = {
  ready: false,
  user: null,
  login,
  logout,
  hydrateSession,
  resolveNextPath
};

function getSnapshot() {
  return state;
}

export function useAuthStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
