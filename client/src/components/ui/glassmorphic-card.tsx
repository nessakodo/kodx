import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isInteractive?: boolean;
  borderGlow?: "blue" | "purple" | "green" | "none";
}

export function GlassmorphicCard({
  children,
  className,
  isInteractive = false,
  borderGlow = "blue",
  ...props
}: GlassmorphicCardProps) {
  const getBorderGlowClass = () => {
    switch (borderGlow) {
      case "blue":
        return "hover:border-[#9ecfff]/40 hover:shadow-[0_0_15px_rgba(158,207,255,0.15)]";
      case "purple":
        return "hover:border-[#b166ff]/40 hover:shadow-[0_0_15px_rgba(177,102,255,0.15)]";
      case "green":
        return "hover:border-[#88c9b7]/40 hover:shadow-[0_0_15px_rgba(136,201,183,0.15)]";
      case "none":
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg bg-[#1e2535]/30 border border-[#9ecfff]/10 backdrop-blur-sm transition-all duration-300",
        isInteractive && `cursor-pointer hover:bg-[#1e2535]/50 ${getBorderGlowClass()}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}