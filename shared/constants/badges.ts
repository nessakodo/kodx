// Badge definitions with categories and rarities
export type BadgeCategory = "labs" | "community" | "meta" | "leveling" | "reflection" | 
  "projects" | "security" | "creativity" | "mindful-tech" | "quirky";

export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  timestampEarned: string | null;
}

export const BADGES: Badge[] = [
  {
    id: "lab_starter",
    name: "Lab Starter",
    description: "Completed your first lab",
    category: "labs",
    rarity: "common",
    timestampEarned: null
  },
  {
    id: "forum_poster",
    name: "First Post",
    description: "Made your first forum post",
    category: "community",
    rarity: "common",
    timestampEarned: null
  },
  {
    id: "founder",
    name: "Founding Member",
    description: "Early member of KODΞX.WORLD",
    category: "meta",
    rarity: "legendary",
    timestampEarned: null
  },
  {
    id: "level_10",
    name: "Level 10 Achiever",
    description: "Reached Level 10 – your power is growing",
    category: "leveling",
    rarity: "uncommon",
    timestampEarned: null
  },
  {
    id: "devlog_scribe",
    name: "Devlog Scribe",
    description: "Shared your first project reflection in the forum",
    category: "reflection",
    rarity: "common",
    timestampEarned: null
  },
  {
    id: "project_builder",
    name: "Project Builder",
    description: "Completed your first project",
    category: "projects",
    rarity: "common",
    timestampEarned: null
  },
  {
    id: "secure_thinker",
    name: "Secure Thinker",
    description: "Completed a lab in the Cybersecurity Pathway",
    category: "security",
    rarity: "uncommon",
    timestampEarned: null
  },
  {
    id: "creative_agent",
    name: "Creative Agent",
    description: "Completed a project in the Creative Coding Pathway",
    category: "creativity",
    rarity: "uncommon",
    timestampEarned: null
  },
  {
    id: "ritualist",
    name: "Digital Ritualist",
    description: "Submitted a reflection on tech and intention",
    category: "mindful-tech",
    rarity: "uncommon",
    timestampEarned: null
  },
  {
    id: "mentor",
    name: "Community Mentor",
    description: "Marked as helpful in 3 forum threads",
    category: "community",
    rarity: "rare",
    timestampEarned: null
  },
  {
    id: "deep_dive",
    name: "Deep Diver",
    description: "Completed 5+ labs in one learning path",
    category: "labs",
    rarity: "uncommon",
    timestampEarned: null
  },
  {
    id: "night_runner",
    name: "Night Runner",
    description: "Logged progress between 12:00 AM and 5:00 AM",
    category: "quirky",
    rarity: "rare",
    timestampEarned: null
  },
  {
    id: "open_source_contributor",
    name: "Open Source Contributor",
    description: "Linked a GitHub repo in your project submission",
    category: "projects",
    rarity: "rare",
    timestampEarned: null
  },
  {
    id: "signal_seeker",
    name: "Newsletter Subscriber",
    description: "Subscribed to the KODΞX SIGNAL newsletter",
    category: "meta",
    rarity: "common",
    timestampEarned: null
  },
  {
    id: "early_supporter",
    name: "Early Supporter",
    description: "Supported KODΞX in its first year of launch",
    category: "meta",
    rarity: "legendary",
    timestampEarned: null
  },
  {
    id: "glowkeeper",
    name: "Glowkeeper",
    description: "Completed 3 projects with a glowing review",
    category: "projects",
    rarity: "epic",
    timestampEarned: null
  }
];

// Badge colors by category
export const BADGE_CATEGORY_COLORS = {
  labs: "bg-blue-500",
  community: "bg-green-500",
  meta: "bg-purple-500",
  leveling: "bg-amber-500",
  reflection: "bg-indigo-500",
  projects: "bg-cyan-500",
  security: "bg-red-500",
  creativity: "bg-pink-500",
  "mindful-tech": "bg-emerald-500",
  quirky: "bg-fuchsia-500"
};

// Badge glow by rarity
export const BADGE_RARITY_EFFECTS = {
  common: "border-gray-300",
  uncommon: "border-blue-300 shadow-sm",
  rare: "border-blue-400 shadow-md",
  epic: "border-purple-500 shadow-lg animate-pulse",
  legendary: "border-amber-500 shadow-xl animate-glow"
};

// Get badge by ID
export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(badge => badge.id === id);
}

// Get badges by category
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return BADGES.filter(badge => badge.category === category);
}

// Get badges by rarity
export function getBadgesByRarity(rarity: BadgeRarity): Badge[] {
  return BADGES.filter(badge => badge.rarity === rarity);
}