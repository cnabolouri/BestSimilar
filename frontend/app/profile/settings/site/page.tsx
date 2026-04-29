import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default function SiteSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Site Settings"
      description="Manage theme, layout density, autoplay, animations, and display options."
    >
      <SiteSettingsForm />
    </ProfileSettingsShell>
  );
}
