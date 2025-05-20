import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function calculateLevelProgress(xp: number): number {
  const level = calculateLevel(xp);
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  return Math.round(((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100);
}

export function getDifficultyClasses(difficulty: string): {
  gradientClasses: string;
  borderClasses: string;
  label: string;
} {
  const difficultyStyles = {
    beginner: {
      gradientClasses: "from-[#9ecfff]/10 to-[#88c9b7]/10",
      borderClasses: "border-[#9ecfff]/20",
      label: "Beginner"
    },
    intermediate: {
      gradientClasses: "from-[#b166ff]/10 to-[#9ecfff]/10",
      borderClasses: "border-[#b166ff]/20",
      label: "Intermediate"
    },
    advanced: {
      gradientClasses: "from-[#ff5c5c]/10 to-[#b166ff]/10",
      borderClasses: "border-[#ff5c5c]/20",
      label: "Advanced"
    }
  };

  return difficultyStyles[difficulty as keyof typeof difficultyStyles] || difficultyStyles.beginner;
}

export function getCategoryStyle(category: string) {
  switch (category?.toLowerCase()) {
    case 'announcement':
      return {
        gradient: "from-[#88c9b7]/10 to-[#88c9b7]/10",
        border: "border-[#88c9b7]/20"
      };
    case 'question':
      return {
        gradient: "from-[#9ecfff]/10 to-[#9ecfff]/10",
        border: "border-[#9ecfff]/20"
      };
    case 'devlog':
      return {
        gradient: "from-[#b166ff]/10 to-[#9ecfff]/10",
        border: "border-[#b166ff]/20"
      };
    default:
      return {
        gradient: "from-gray-500/10 to-gray-500/10",
        border: "border-gray-500/20"
      };
  }
}
