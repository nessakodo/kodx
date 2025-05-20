import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const KodexCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    variant?: "default" | "success" | "warning" | "danger";
  }
>(({ className, variant = "default", ...props }, ref) => {
  // Color variants for checkboxes
  const variants = {
    default: "border-[#1e293b] hover:border-[#9ecfff]/50 data-[state=checked]:bg-[#9ecfff] data-[state=checked]:border-[#9ecfff]",
    success: "border-[#1e293b] hover:border-[#88c9b7]/50 data-[state=checked]:bg-[#88c9b7] data-[state=checked]:border-[#88c9b7]",
    warning: "border-[#1e293b] hover:border-[#ffb86c]/50 data-[state=checked]:bg-[#ffb86c] data-[state=checked]:border-[#ffb86c]",
    danger: "border-[#1e293b] hover:border-[#cf6679]/50 data-[state=checked]:bg-[#cf6679] data-[state=checked]:border-[#cf6679]",
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-full border-2 bg-[#1e293b]/50 ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:data-[state=checked]:opacity-70",
        variants[variant],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <CheckIcon className="h-3 w-3 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

KodexCheckbox.displayName = "KodexCheckbox";

export { KodexCheckbox };