import { Badge } from "@/components/ui/badge";

interface DifficultyBadgeProps {
  level: string;
  className?: string;
}

export function DifficultyBadge({ level, className = "" }: DifficultyBadgeProps) {
  // Normalize level for consistent styling regardless of casing
  const normalizedLevel = level.toLowerCase();
  
  let badgeClass = "";
  
  switch (normalizedLevel) {
    case "beginner":
      badgeClass = "badge-beginner";
      break;
    case "intermediate":
      badgeClass = "badge-intermediate";
      break;
    case "advanced":
      badgeClass = "badge-advanced";
      break;
    default:
      badgeClass = "badge-intermediate";
  }
  
  return (
    <Badge className={`text-xs uppercase px-3 py-1 font-medium tracking-wider border bg-transparent ${badgeClass} ${className}`}>
      {level}
    </Badge>
  );
}