import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[#9ecfff]/20 bg-[#1e2535]/50 backdrop-blur-sm text-white hover:bg-[#1e2535]/70 hover:border-[#9ecfff]/30 hover:shadow-[0_0_15px_rgba(158,207,255,0.2)]",
        primary:
          "border border-[#9ecfff]/30 bg-[#9ecfff]/10 backdrop-blur-sm text-[#9ecfff] hover:bg-[#9ecfff]/20 hover:shadow-[0_0_15px_rgba(158,207,255,0.3)]",
        secondary:
          "border border-[#88c9b7]/30 bg-[#88c9b7]/10 backdrop-blur-sm text-[#88c9b7] hover:bg-[#88c9b7]/20 hover:shadow-[0_0_15px_rgba(136,201,183,0.3)]",
        accent:
          "border border-[#bb86fc]/30 bg-[#bb86fc]/10 backdrop-blur-sm text-[#bb86fc] hover:bg-[#bb86fc]/20 hover:shadow-[0_0_15px_rgba(187,134,252,0.3)]",
        destructive:
          "border border-[#ff5c5c]/30 bg-[#ff5c5c]/10 backdrop-blur-sm text-[#ff5c5c] hover:bg-[#ff5c5c]/20 hover:shadow-[0_0_15px_rgba(255,92,92,0.3)]",
        success:
          "border border-[#6fcf97]/30 bg-[#6fcf97]/10 backdrop-blur-sm text-[#6fcf97] hover:bg-[#6fcf97]/20 hover:shadow-[0_0_15px_rgba(111,207,151,0.3)]",
        ghost:
          "bg-transparent text-[#9ecfff] hover:bg-[#1e2535]/50 hover:text-white",
        link:
          "bg-transparent text-[#9ecfff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassmorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const GlassmorphicButton = React.forwardRef<HTMLButtonElement, GlassmorphicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassmorphicButton.displayName = "GlassmorphicButton";

export { GlassmorphicButton, buttonVariants };