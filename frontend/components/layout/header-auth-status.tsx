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
import { logoutUser } from "@/services/auth";
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

  async function handleLogout() {
    const path = window.location.pathname;
    let publicProfilePath: string | null = null;
    const isPrivateProfilePath =
      path === "/profile" ||
      path === "/profile/watchlist" ||
      path === "/profile/favorites" ||
      path === "/profile/history" ||
      path === "/profile/ratings" ||
      path.startsWith("/profile/settings");

    try {
      if (isPrivateProfilePath) {
        const profile = await getCurrentProfile();
        const username = profile.username_slug || profile.username;
        publicProfilePath = username ? `/profile/${username}` : null;
      }
    } catch {
      publicProfilePath = null;
    }

    try {
      await logoutUser();
    } finally {
      onAction?.();

      if (publicProfilePath) {
        window.location.href = publicProfilePath;
      } else if (path.startsWith("/profile/") && !isPrivateProfilePath) {
        window.location.href = path;
      } else if (isPrivateProfilePath) {
        window.location.href = "/login?next=/profile";
      } else {
        window.location.href = path;
      }
    }
  }

  // Handle the signed-out state
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {!compact ? (
          <Link
            href={loginHref}
            onClick={onAction}
            className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Login / Signup
          </Link>
        ) : null}
        {compact ? (
          <Link
            href={loginHref}
            onClick={onAction}
            className="inline-flex h-10 items-center rounded-full bg-accent px-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Sign in
          </Link>
        ) : null}
      </div>
    );
  }

  // Handle the signed-in state
  return (
    <ProfileMenu
      user={user}
      onAction={onAction}
      onLogout={handleLogout}
      compact={compact}
    />
  );
}
