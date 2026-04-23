import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand";
import Image from "next/image";

const SIZE_PX = { sm: 36, md: 44, lg: 48 } as const;

type BrandLogoProps = {
  size?: keyof typeof SIZE_PX;
  /** Classes do contentor (sombra, anel, hover em grupo, etc.) */
  className?: string;
};

/** Logo da marca centrada dentro do quadrado (object-contain), para header e login. */
export function BrandLogo({ size = "sm", className }: BrandLogoProps) {
  const px = SIZE_PX[size];
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-paper ${className ?? ""}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={BRAND_LOGO_SRC}
        alt={BRAND_LOGO_ALT}
        fill
        sizes={`${px}px`}
        className="object-contain object-center p-[12%]"
        priority
      />
    </span>
  );
}
