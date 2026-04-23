// export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
//       <path
//         d="M44 12H31C19.402 12 10 21.402 10 33s9.402 21 21 21h13V41H31c-4.418 0-8-3.582-8-8s3.582-8 8-8h13z"
//         className="stroke-accent"
//         strokeWidth="4"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M44 20c-11.2 0-18.351 5.756-24 16"
//         className="stroke-accent"
//         strokeWidth="4"
//         strokeLinecap="round"
//       />
//       <path
//         d="M22 39c4.276 4.201 9.45 6 17 6"
//         className="stroke-accent"
//         strokeWidth="4"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
import Image from "next/image";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/branding/simcine-mark.png"
      alt="Simcine"
      width={512}
      height={512}
      priority
      className={className}
    />
  );
}