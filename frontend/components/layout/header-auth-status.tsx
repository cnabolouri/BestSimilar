// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { getMe, type AuthUser } from "@/services/auth";
// import { ProfileMenu } from "@/components/layout/profile-menu";

// export function HeaderAuthStatus({ onAction }: { onAction?: () => void }) {
//   const [user, setUser] = useState<AuthUser | null>(null);

//   useEffect(() => {
//     async function loadUser() {
//       try {
//         const me = await getMe();
//         setUser(me);
//       } catch {
//         setUser(null);
//       }
//     }

//     loadUser();
//   }, []);

//   // Handle the signed-in state
//   if (user) {
//     return <ProfileMenu user={user} onAction={onAction} />;
//   }

//   // Handle the signed-out state
//   return (
//     <Link
//       href="/login"
//       onClick={onAction}
//       className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
//     >
//       LOGIN/SIGNUP
//     </Link>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMe, type AuthUser } from "@/services/auth";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { usePathname } from "next/navigation";

export function HeaderAuthStatus({
  onAction,
  compact = false,
}: {
  onAction?: () => void;
  compact?: boolean;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
    const pathname = usePathname();
    const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  // Handle the signed-out state
  if (!user) {
    return (
        <Link
        href={loginHref}
        onClick={onAction}
        className={[
            "inline-flex h-10 items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground transition hover:opacity-90",
            compact ? "px-3" : "px-4",
        ].join(" ")}
        >
        {compact ? "Sign in" : "Sign up / Sign in"}
        </Link>
    );
  }

  // Handle the signed-in state
  return <ProfileMenu user={user} onAction={onAction} compact={compact} />;
}