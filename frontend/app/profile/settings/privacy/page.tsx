import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { PrivacySettingsForm } from "./PrivacySettingsForm";

export default function PrivacySettingsPage() {
  return (
    <ProfileSettingsShell
      title="Privacy"
      description="Control what parts of your profile are visible to others."
    >
      <PrivacySettingsForm />
    </ProfileSettingsShell>
  );
}
