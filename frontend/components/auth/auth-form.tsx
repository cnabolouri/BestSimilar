"use client";

import { useState } from "react";
import { loginUser, signupUser } from "@/services/auth";
import { useSearchParams } from "next/navigation";

type Mode = "login" | "signup";

export function AuthForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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