"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, signupUser } from "@/services/auth";

type Mode = "login" | "signup";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function AuthForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/profile";
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        await loginUser({ username, password });
        setMessage("Signed in successfully.");
      } else {
        await signupUser({ username, email, password });
        setMessage("Account created successfully.");
      }

      window.location.href = nextUrl;
    } catch {
      setMessage("Authentication failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Save favorites, build your watchlist, and personalize recommendations.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              mode === "login"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => setMode("signup")}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              mode === "signup"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Sign up
          </button>
        </div>

        {/* Google sign-in */}
        <div className="mt-6">
          <a
            href={`${API_BASE}/auth/google/?next=${encodeURIComponent(nextUrl)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
              required
            />
          </div>

          {mode === "signup" ? (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
              />
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
              required
            />
          </div>

          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}

          <button
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-accent text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
