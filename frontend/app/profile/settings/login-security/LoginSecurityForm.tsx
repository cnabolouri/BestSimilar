"use client";

import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import {
  changePassword,
  getSecurityDetails,
  updateSecurityDetails,
} from "@/services/profile";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function LoginSecurityForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [identityMessage, setIdentityMessage] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    getSecurityDetails()
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
      })
      .catch((err) => {
        setIdentityError(
          err instanceof Error ? err.message : "Failed to load account details.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleIdentitySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingIdentity(true);
    setIdentityMessage(null);
    setIdentityError(null);

    try {
      const updated = await updateSecurityDetails({ username, email });
      setUsername(updated.username || "");
      setEmail(updated.email || "");
      setIdentityMessage("Account details updated.");
    } catch (err) {
      setIdentityError(
        err instanceof Error ? err.message : "Failed to update account details.",
      );
    } finally {
      setSavingIdentity(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordMessage(response.detail || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <SettingsPanel title="Account Identity">
        <p className="text-sm text-muted-foreground">Loading account details...</p>
      </SettingsPanel>
    );
  }

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Account Identity"
        description="Your username controls your public profile URL."
      >
        <form onSubmit={handleIdentitySubmit} className="grid gap-4">
          {identityMessage && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
              {identityMessage}
            </div>
          )}
          {identityError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {identityError}
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
            <p className="text-xs text-muted-foreground">
              Your public profile will be available at /profile/{username || "username"}.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingIdentity}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingIdentity ? "Saving..." : "Save Account Changes"}
            </button>
          </div>
        </form>
      </SettingsPanel>

      <SettingsPanel
        title="Password"
        description="Update your password to keep your account secure."
      >
        <form onSubmit={handlePasswordSubmit} className="grid gap-4">
          {passwordMessage && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
              {passwordMessage}
            </div>
          )}
          {passwordError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {passwordError}
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </SettingsPanel>

      <SettingsPanel
        title="Connected Accounts"
        description="Connect external accounts for easier and safer sign in."
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div>
              <p className="text-sm font-medium">Google</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use your Google account to sign in to Simcine.
              </p>
            </div>
          </div>
          <a
            href={`${API_BASE}/auth/google/?next=${encodeURIComponent("/profile/settings/login-security")}`}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
          >
            Connect
          </a>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Authenticator app</p>
              <p className="mt-1 text-xs text-muted-foreground">
                TOTP-based two-factor authentication will be added after MVP.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              Coming soon
            </span>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}
