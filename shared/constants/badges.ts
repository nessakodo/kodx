// Badge system constants

// Badge categories
export type BadgeCategory = 'achievement' | 'learning' | 'community' | 'security' | 'wellbeing';

// Badge rarities (common, uncommon, rare, epic, legendary)
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Badge definition interface
export interface Badge {
  id: number;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  createdAt?: string;
  unlockCriteria?: string;
}

// Color mappings for badge categories
export const BADGE_CATEGORY_COLORS: Record<BadgeCategory, {text: string, bg: string, border: string, gradient: string}> = {
  achievement: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    gradient: 'rgba(245, 158, 11, 0.7)'
  },
  learning: {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    gradient: 'rgba(99, 102, 241, 0.7)'
  },
  community: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    gradient: 'rgba(59, 130, 246, 0.7)'
  },
  security: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    gradient: 'rgba(168, 85, 247, 0.7)'
  },
  wellbeing: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradient: 'rgba(16, 185, 129, 0.7)'
  }
};

// Visual effects based on badge rarity
export const BADGE_RARITY_EFFECTS: Record<BadgeRarity, {borderColor: string, glow: string, animation: string}> = {
  common: {
    borderColor: 'rgba(148, 163, 184, 0.5)',
    glow: '0 0 10px rgba(148, 163, 184, 0.3)',
    animation: 'pulse 2s infinite'
  },
  uncommon: {
    borderColor: 'rgba(34, 197, 94, 0.5)',
    glow: '0 0 15px rgba(34, 197, 94, 0.4)',
    animation: 'pulse 2s infinite'
  },
  rare: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    animation: 'pulse 1.5s infinite'
  },
  epic: {
    borderColor: 'rgba(168, 85, 247, 0.5)',
    glow: '0 0 25px rgba(168, 85, 247, 0.6)',
    animation: 'pulse 1.5s infinite'
  },
  legendary: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    glow: '0 0 30px rgba(245, 158, 11, 0.7)',
    animation: 'pulse 1s infinite'
  }
};