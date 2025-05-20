import { cn } from "@/lib/utils";

interface KodexLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function KodexLogo({ size = "md", className }: KodexLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl md:text-6xl",
  };

  return (
    <h1 
      className={cn(
        "font-orbitron font-bold tracking-widest bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent drop-shadow-glow uppercase",
        sizeClasses[size],
        className
      )}
    >
      KODΞX
    </h1>
  );
}
