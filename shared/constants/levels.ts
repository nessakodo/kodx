// Level definitions with XP thresholds
export const LEVELS = [
  {
    level: 1,
    title: "Digital Initiate",
    message: "Your journey begins. The path to digital sovereignty opens.",
    xpRequired: 0
  },
  {
    level: 2,
    title: "Bit Wanderer",
    message: "First steps taken. The digital landscape unfolds before you.",
    xpRequired: 141
  },
  {
    level: 5,
    title: "Code Explorer",
    message: "You've begun shaping the systems around you.",
    xpRequired: 559
  },
  {
    level: 10,
    title: "Circuit Voyager",
    message: "The tools have become extensions of your thought.",
    xpRequired: 3162
  },
  {
    level: 15,
    title: "Signal Scribe",
    message: "You now translate chaos into clarity.",
    xpRequired: 6510
  },
  {
    level: 20,
    title: "Protocol Architect",
    message: "You no longer just build—you design with intention.",
    xpRequired: 8944
  },
  {
    level: 30,
    title: "Cyber Sage",
    message: "Systems reveal themselves to you as patterns.",
    xpRequired: 16431
  },
  {
    level: 50,
    title: "Sovereignty Keeper",
    message: "You code with purpose. You lead with awareness.",
    xpRequired: 35355
  }
];

// Helper function to calculate level based on XP
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  
  // Search through the levels array to find the highest level the user has reached
  let currentLevel = 1;
  
  for (const levelData of LEVELS) {
    if (xp >= levelData.xpRequired) {
      currentLevel = levelData.level;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

// Helper function to get level data
export function getLevelData(level: number) {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
}

// Helper function to calculate XP needed for next level
export function getXpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  
  const nextLevelData = LEVELS.find(l => l.level === nextLevel);
  if (!nextLevelData) {
    // If max level reached, return current XP
    return currentXp;
  }
  
  return nextLevelData.xpRequired;
}

// Helper function to calculate level progress percentage
export function calculateLevelProgress(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  const currentLevelData = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);
  
  // If at max level, return 100%
  if (!nextLevelData) return 100;
  
  const currentLevelXp = currentLevelData.xpRequired;
  const nextLevelXp = nextLevelData.xpRequired;
  const xpRange = nextLevelXp - currentLevelXp;
  const xpProgress = currentXp - currentLevelXp;
  
  return Math.min(100, Math.max(0, Math.floor((xpProgress / xpRange) * 100)));
}