import { cn } from "@/lib/utils";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassmorphicCard({ 
  children, 
  className,
  ...props
}: GlassmorphicCardProps) {
  return (
    <div 
      className={cn(
        "glassmorphic rounded-xl shadow-lg", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}