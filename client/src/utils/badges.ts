import { BADGES } from '@shared/constants/badges';

// Function to award a badge to a user
export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/badges/award', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, badgeId }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
}

// Function to award the founder badge to a new user
export async function awardFounderBadge(userId: string): Promise<boolean> {
  return awardBadge(userId, 'founder');
}

// Function to get all badges for a user
export async function getUserBadges(userId: string) {
  try {
    const response = await fetch(`/api/badges/user/${userId}`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
}

// Function to get all available badges
export function getAllBadges() {
  return BADGES;
}

// Export an empty state badges array with grayed out badges
export const emptyStateBadges = BADGES.map(badge => ({
  ...badge,
  timestampEarned: null, // All badges are locked/grayed out
}));