// Level-based progression system

// Base XP formula - each level requires more XP than the previous
export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Get XP required for the next level
export function getXpForNextLevel(currentLevel: number): number {
  return getXpForLevel(currentLevel + 1);
}

// Calculate user level based on total XP
export function calculateLevel(totalXp: number): number {
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

// Calculate progress percentage to next level
export function calculateLevelProgress(totalXp: number): number {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  
  const xpInCurrentLevel = totalXp - currentLevelXp;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
}

// Get level data including title and message
export function getLevelData(level: number) {
  const levelTitles = [
    { level: 1, title: "Digital Awakening", message: "The start of your tech enlightenment journey" },
    { level: 2, title: "Conscious Explorer", message: "Beginning to navigate the digital realm with awareness" },
    { level: 3, title: "Code Apprentice", message: "Developing foundational understanding of technology structures" },
    { level: 4, title: "Mindful Technologist", message: "Combining technical skill with balanced perspective" },
    { level: 5, title: "Cyber Adept", message: "Gaining deeper insights into digital systems" },
    { level: 6, title: "Digital Harmonizer", message: "Creating balance between technology and wellbeing" },
    { level: 7, title: "Tech Meditator", message: "Approaching technology with focused intention" },
    { level: 8, title: "Circuit Sage", message: "Merging technical knowledge with wisdom" },
    { level: 9, title: "Quantum Thinker", message: "Understanding complex interconnections in technology" },
    { level: 10, title: "Digital Monk", message: "Achieving mastery of technical and mindful practices" }
  ];
  
  const defaultTitle = { 
    title: `Zen Level ${level}`, 
    message: "Continuing your journey toward digital enlightenment"
  };
  
  const levelData = levelTitles.find(l => l.level === level) || defaultTitle;
  
  return {
    level,
    xpRequired: getXpForLevel(level),
    ...levelData
  };
}