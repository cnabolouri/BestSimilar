import Link from "next/link";
import { LogoLockup } from "@/components/branding/logo-lockup";
import { HeaderSearch } from "@/components/layout/header-search";
import { HeaderAuthStatus } from "@/components/layout/header-auth-status";
import { MobileMenu } from "@/components/layout/mobile-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/people", label: "People" },
];

// export function SiteHeader() {
//   return (
//     <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
//       <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-6 md:px-8 lg:px-10">
//         <div className="shrink-0">
//           <LogoLockup />
//         </div>

//         <nav className="hidden shrink-0 items-center gap-6 lg:flex">
//           <Link href="/" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
//             Home
//           </Link>
//           <Link href="/discover" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
//             Discover
//           </Link>
//           <Link href="/movies" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
//             Movies
//           </Link>
//           <Link href="/tv" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
//             TV Shows
//           </Link>
//           <Link href="/people" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
//             People
//           </Link>
//         </nav>

//         <div className="hidden min-w-[280px] max-w-md flex-1 lg:block">
//           <HeaderSearch />
//         </div>

//         <div className="ml-auto hidden shrink-0 lg:block">
//           <HeaderAuthStatus />
//         </div>

//         <div className="ml-auto flex items-center gap-2 lg:hidden">
//           <HeaderAuthStatus compact />
//           <MobileMenu />
//         </div>
//       </div>
//     </header>
//   );
// }

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-20 w-full max-w-[1440px] items-center gap-6 px-4 md:px-10 lg:mr-2">
        <div className="shrink-0">
          <LogoLockup />
        </div>

        <nav className="hidden shrink-0 items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-[280px] max-w-md flex-1 lg:block">
          <HeaderSearch />
        </div>

        {/* Desktop Auth */}
        <div className="ml-auto hidden shrink-0 lg:block">
          <HeaderAuthStatus />
        </div>

        {/* Mobile/Tablet Auth */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <HeaderAuthStatus compact />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}