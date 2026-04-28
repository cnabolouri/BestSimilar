import { cookies } from "next/headers";
import type { InteractionSummary, ProfileSummary, ProfileUser } from "@/services/profile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function serverApiFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getCurrentProfileServer() {
  return serverApiFetch<ProfileUser>("/auth/profile/");
}

export function getProfileSummaryServer() {
  return serverApiFetch<ProfileSummary>("/auth/profile/summary/");
}

export function getInteractionSummaryServer() {
  return serverApiFetch<InteractionSummary>("/interactions/me/summary/");
}
