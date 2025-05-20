import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Container({ children, className, fullWidth = false }: ContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto w-full px-4 sm:px-6 md:px-8",
        fullWidth ? "max-w-full" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}