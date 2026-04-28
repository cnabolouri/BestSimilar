import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentProfileServer } from "@/services/server-profile";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function safeNextPath(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/profile";
  }

  return next;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  let isAuthenticated = false;

  try {
    await getCurrentProfileServer();
    isAuthenticated = true;
  } catch {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    redirect(nextPath);
  }

  return <AuthForm />;
}
