"use client";

import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import {
  changePassword,
  getSecurityDetails,
  updateSecurityDetails,
} from "@/services/profile";

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
    </div>
  );
}
