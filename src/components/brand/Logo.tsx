import Image from "next/image";
import clsx from "clsx";

interface LogoProps {
  /** `dark` = for dark backgrounds (white "Veh"), `light` = original logo colors. */
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}

/** VehiRIS wordmark (613 × 135 source). Size it with a height class, e.g. `h-7`. */
export function Logo({ tone = "dark", className, priority }: LogoProps) {
  return (
    <Image
      src={tone === "dark" ? "/brand/logo-mark-white.png" : "/brand/logo-mark.png"}
      alt="VehIRIS"
      width={613}
      height={135}
      priority={priority}
      className={clsx("w-auto select-none", className ?? "h-7")}
      draggable={false}
    />
  );
}
