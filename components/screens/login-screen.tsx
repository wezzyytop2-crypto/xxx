"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PREDEFINED_USERS } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/authStore";

export function LoginScreen() {
  const router = useRouter();
  const { login, ready, user, resolveNextPath } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetUser = params.get("user");
    setNextPath(resolveNextPath(params.get("next")));

    if (presetUser === "user1" || presetUser === "user2") {
      setUsername(presetUser);
    }
  }, [resolveNextPath]);

  useEffect(() => {
    if (ready && user) {
      router.replace(nextPath);
    }
  }, [nextPath, ready, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await login({
        username,
        password
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace(nextPath);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="glass-panel w-full max-w-md rounded-[36px] p-6">
        <div className="space-y-3 text-center">
          <p className="section-kicker">Local Access</p>
          <h1 className="text-3xl font-semibold text-text">Вход в LIMBI</h1>
          <p className="text-sm leading-6 text-muted">
            Приложение работает полностью локально. У каждого пользователя свой набор карточек, прогресс и статистика.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {PREDEFINED_USERS.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => setUsername(account.username)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                username === account.username
                  ? "primary-action text-slate-950"
                  : "secondary-action text-text"
              }`}
            >
              {account.username}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="username">
              Username
            </label>
            <div className="field-shell rounded-[24px] px-4 py-3">
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="user1 или user2"
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/80"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="password">
              Password
            </label>
            <div className="field-shell rounded-[24px] px-4 py-3">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Введите пароль"
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/80"
              />
            </div>
          </div>

          {error ? <p className="rounded-[22px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="primary-action inline-flex w-full items-center justify-center rounded-[26px] px-4 py-3.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {submitting ? "Проверяю..." : "Войти"}
          </button>
        </form>

        <div className="mt-5 rounded-[24px] border border-line bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Как это работает</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            После входа сессия сохраняется локально, а данные в IndexedDB автоматически изолируются по пользователю.
          </p>
        </div>

        {nextPath !== "/" ? (
          <p className="mt-4 text-center text-xs text-muted">
            После входа вернём на <Link href={nextPath} className="text-accent">{nextPath}</Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
