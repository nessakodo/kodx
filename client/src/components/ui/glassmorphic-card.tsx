import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassmorphicCard({ children, className }: GlassmorphicCardProps) {
  return (
    <div className={cn(
      "bg-[#1e2535]/25 backdrop-blur-md border border-[#9ecfff]/10 rounded-lg shadow-lg", 
      className
    )}>
      {children}
    </div>
  );
}