import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { PersonalInfoForm } from "./PersonalInfoForm";

export default function PersonalInfoSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Personal Info"
      description="Edit your display name, profile image, and bio."
    >
      <PersonalInfoForm />
    </ProfileSettingsShell>
  );
}
