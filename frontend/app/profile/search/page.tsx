import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProfileSearchRedirectPage({
  searchParams,
}: PageProps) {
  const { q = "" } = await searchParams;
  redirect(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
}
