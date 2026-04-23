import { LogoMark } from "@/components/branding/logo-mark";

export function LogoLockup() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className="h-9 w-9" />
      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-tight">Simcine</span>
        <span className="mt-1 text-xs text-muted-foreground">Find what feels similar.</span>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useTheme } from "@/components/layout/theme-provider";

// type LogoLockupProps = {
//   href?: string;
//   priority?: boolean;
//   className?: string;
// };

// export function LogoLockup({
//   href,
//   priority = false,
//   className = "",
// }: LogoLockupProps) {
//   const { theme } = useTheme();

//   const src =
//     theme === "dark"
//       ? "/branding/simcine-lockup-dark.png"
//       : "/branding/simcine-lockup-light.png";

//   const content = (
//     <Image
//       src={src}
//       alt="Simcine"
//       width={1200}
//       height={300}
//       priority={priority}
//       className={`h-10 w-auto ${className}`}
//     />
//   );

//   if (href) {
//     return <Link href={href}>{content}</Link>;
//   }

//   return content;
// }