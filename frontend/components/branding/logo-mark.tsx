import Image from "next/image";
import Link from "next/link";

export function LogoMark({
  className = "h-8 w-8",
  clickable = false,
}: {
  className?: string;
  clickable?: boolean;
}) {
  const image = (
    <Image
      src="/branding/simcine-mark.png"
      alt="Simcine"
      width={32}
      height={32}
      priority
      className={className}
    />
  );

  if (clickable) {
    return <Link href="/">{image}</Link>;
  }

  return image;
}