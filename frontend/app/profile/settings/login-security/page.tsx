import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { LoginSecurityForm } from "./LoginSecurityForm";

export default function LoginSecuritySettingsPage() {
  return (
    <ProfileSettingsShell
      title="Login & Security"
      description="Manage your username, email, password, and sign-in options."
    >
      <LoginSecurityForm />
    </ProfileSettingsShell>
  );
}
