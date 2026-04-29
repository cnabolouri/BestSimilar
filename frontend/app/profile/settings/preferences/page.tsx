import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { PreferencesForm } from "./PreferencesForm";

export default function PreferencesSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Preferences"
      description="Manage favorite genres, languages, countries, providers, and content preferences."
    >
      <PreferencesForm />
    </ProfileSettingsShell>
  );
}
