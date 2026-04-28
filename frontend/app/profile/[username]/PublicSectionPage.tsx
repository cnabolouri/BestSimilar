import { notFound } from "next/navigation";
import {
  getPublicInteractionSection,
  type PublicFavoritesResponse,
} from "@/services/public-profile";

type PublicSectionPageProps = {
  username: string;
  section: "watchlist" | "favorites" | "history" | "ratings" | "reviews";
  title: string;
  emptyText: string;
  privateText: string;
};

export async function PublicSectionPage({
  username,
  section,
  title,
  emptyText,
  privateText,
}: PublicSectionPageProps) {
  let result;

  try {
    result =
      section === "favorites"
        ? await getPublicInteractionSection<PublicFavoritesResponse>(
            username,
            section,
          )
        : await getPublicInteractionSection<unknown[]>(username, section);
  } catch {
    notFound();
  }

  if (result.status === "private") {
    return (
      <main className="bg-background px-4 py-6 text-foreground">
        <section className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{privateText}</p>
        </section>
      </main>
    );
  }

  const itemCount =
    section === "favorites"
      ? (result.data as PublicFavoritesResponse).titles.length +
        (result.data as PublicFavoritesResponse).people.length
      : (result.data as unknown[]).length;

  return (
    <main className="bg-background px-4 py-6 text-foreground">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold">{title}</h1>

        <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          {itemCount === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            <pre className="overflow-auto text-xs">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </main>
  );
}
