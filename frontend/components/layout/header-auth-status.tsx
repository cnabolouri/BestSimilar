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
import { ProfileMenu } from "@/components/layout/profile-menu";
import { usePathname } from "next/navigation";
import { getCurrentProfile, type ProfileUser } from "@/services/profile";

export function HeaderAuthStatus({
  onAction,
  compact = false,
}: {
  onAction?: () => void;
  compact?: boolean;
}) {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getCurrentProfile();
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
      <div className="flex items-center gap-2">
        {!compact ? (
          <>
            <Link
              href="/profile/search"
              onClick={onAction}
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:bg-card hover:text-foreground"
            >
              Find Profiles
            </Link>
            <Link
              href={loginHref}
              onClick={onAction}
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:bg-card hover:text-foreground"
            >
              Login
            </Link>
          </>
        ) : null}
        <Link
          href={compact ? loginHref : "/signup"}
          onClick={onAction}
          className={[
            "inline-flex h-10 items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground transition hover:opacity-90",
            compact ? "px-3" : "px-4",
          ].join(" ")}
        >
          {compact ? "Sign in" : "Signup"}
        </Link>
      </div>
    );
  }

  // Handle the signed-in state
  return <ProfileMenu user={user} onAction={onAction} compact={compact} />;
}
