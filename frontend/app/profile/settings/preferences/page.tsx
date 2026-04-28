import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const languages = ["English", "Spanish", "French", "Korean", "Japanese", "Persian"];

const providers = ["Netflix", "Prime Video", "Hulu", "Max", "Disney+", "Apple TV+"];

export default function PreferencesSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Preferences"
      description="Manage favorite genres, languages, countries, providers, and content preferences."
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Taste Profile"
          description="These preferences can later help personalize recommendations."
        >
          <div className="space-y-5">
            <PreferenceGroup title="Favorite Genres" items={genres} />
            <PreferenceGroup title="Preferred Languages" items={languages} />
            <PreferenceGroup title="Streaming Services" items={providers} />
          </div>
        </SettingsPanel>

        <SettingsPanel
          title="Content Preferences"
          description="Control the type of content you prefer to discover."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Preferred format</span>
              <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none">
                <option>Movies and TV</option>
                <option>Movies only</option>
                <option>TV only</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Content rating</span>
              <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none">
                <option>Any rating</option>
                <option>Family friendly</option>
                <option>PG-13 and below</option>
                <option>R / mature allowed</option>
              </select>
            </label>
          </div>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}

function PreferenceGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
