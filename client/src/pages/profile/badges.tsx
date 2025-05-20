import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Badge as BadgeType, BADGES, BadgeCategory, BadgeRarity, BADGE_CATEGORY_COLORS, BADGE_RARITY_EFFECTS } from '@shared/constants/badges';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BadgePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<BadgeCategory | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<BadgeRarity | 'all'>('all');

  // Fetch user badges
  const { data: userBadges = [] } = useQuery({
    queryKey: ['/api/user-badges'],
    enabled: isAuthenticated,
  });

  // Filter badges based on selected filters
  const filteredBadges = BADGES.filter(badge => {
    const categoryMatch = categoryFilter === 'all' ? true : badge.category === categoryFilter;
    const rarityMatch = rarityFilter === 'all' ? true : badge.rarity === rarityFilter;
    return categoryMatch && rarityMatch;
  });

  // Check if user has earned a badge
  const hasBadge = (badgeId: string) => {
    if (!userBadges.length) return false;
    return userBadges.some((userBadge: any) => userBadge.badgeId === badgeId);
  };

  // Format badge earned date
  const formatEarnedDate = (timestamp: string) => {
    if (!timestamp) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  };

  // Get badge state (earned, locked)
  const getBadgeState = (badge: BadgeType) => {
    const earned = hasBadge(badge.id);
    if (earned) {
      const userBadge = userBadges.find((ub: any) => ub.badgeId === badge.id);
      return {
        earned: true,
        earnedDate: formatEarnedDate(userBadge?.timestamp || ''),
      };
    }
    return { earned: false };
  };

  // Get badge style based on rarity
  const getBadgeStyle = (rarity: BadgeRarity, earned: boolean) => {
    const rarityEffect = BADGE_RARITY_EFFECTS[rarity] || {};
    
    if (!earned) {
      return {
        opacity: 0.4,
        filter: 'grayscale(0.8)',
        borderColor: 'rgba(100, 100, 100, 0.2)'
      };
    }
    
    return {
      boxShadow: rarityEffect.glow || 'none',
      borderColor: rarityEffect.borderColor || 'rgba(255, 255, 255, 0.1)',
      animation: rarityEffect.animation
    };
  };

  const categories: { value: BadgeCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'labs', label: 'Labs' },
    { value: 'community', label: 'Community' },
    { value: 'meta', label: 'Meta' },
    { value: 'leveling', label: 'Leveling' },
    { value: 'reflection', label: 'Reflection' },
    { value: 'projects', label: 'Projects' },
    { value: 'security', label: 'Security' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'mindful-tech', label: 'Mindful Tech' },
    { value: 'quirky', label: 'Quirky' },
  ];

  const rarities: { value: BadgeRarity | 'all'; label: string }[] = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-orbitron text-[#9ecfff] mb-2">Achievement Badges</h1>
        <p className="text-gray-400">
          Badges represent milestones in your journey through KodexZen. They're awarded for
          completing labs, projects, and contributing to the community.
        </p>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-sm font-orbitron text-gray-300 mb-2">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={categoryFilter === category.value ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  categoryFilter === category.value
                    ? "bg-[#1e2535] border-[#9ecfff]/50 text-white"
                    : "bg-transparent border-[#9ecfff]/20 text-gray-400 hover:text-white hover:border-[#9ecfff]/40"
                }`}
                onClick={() => setCategoryFilter(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-orbitron text-gray-300 mb-2">Filter by Rarity</h3>
          <div className="flex flex-wrap gap-2">
            {rarities.map((rarity) => (
              <Button
                key={rarity.value}
                variant={rarityFilter === rarity.value ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  rarityFilter === rarity.value
                    ? "bg-[#1e2535] border-[#9ecfff]/50 text-white"
                    : "bg-transparent border-[#9ecfff]/20 text-gray-400 hover:text-white hover:border-[#9ecfff]/40"
                }`}
                onClick={() => setRarityFilter(rarity.value)}
              >
                {rarity.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const badgeState = getBadgeState(badge);
          const badgeStyle = getBadgeStyle(badge.rarity, badgeState.earned);
          const categoryColor = BADGE_CATEGORY_COLORS[badge.category] || { text: 'text-gray-400', bg: 'bg-gray-400/10' };
          
          return (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className={`p-4 flex flex-col items-center justify-center min-h-[230px] border border-[#9ecfff]/20 bg-[#0f172a]/80 backdrop-blur-sm transition-all duration-300 ${
                      badgeState.earned ? 'hover:scale-[1.03] hover:border-[#9ecfff]/40' : 'cursor-default'
                    }`}
                    style={badgeStyle}
                  >
                    <div className="mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-[#1e2535]/70 border-2 border-[#9ecfff]/20">
                      {/* Badge Icon (placeholder, would come from badge data) */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ 
                          background: badgeState.earned 
                            ? `radial-gradient(circle, ${categoryColor.gradient || '#1e2535'} 0%, #1e2535 100%)` 
                            : '#1e2535' 
                        }}
                      >
                        <span className={`text-4xl font-orbitron ${badgeState.earned ? categoryColor.text : 'text-gray-600'}`}>
                          {badge.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className={`text-md font-orbitron text-center mb-1 ${badgeState.earned ? 'text-white' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    
                    <div className="flex gap-2 mt-2">
                      <Badge className={`${categoryColor.bg} ${categoryColor.text} text-xs`}>
                        {badge.category}
                      </Badge>
                      <Badge className={`bg-[#1e2535]/50 text-${
                        badge.rarity === 'common' ? 'gray-400' :
                        badge.rarity === 'uncommon' ? 'blue-400' :
                        badge.rarity === 'rare' ? 'purple-400' :
                        badge.rarity === 'epic' ? 'amber-400' : 'red-400'
                      } text-xs`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    
                    {badgeState.earned && badgeState.earnedDate && (
                      <p className="text-[10px] text-gray-500 mt-2">
                        Earned {badgeState.earnedDate}
                      </p>
                    )}
                  </Card>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  className="p-4 max-w-xs border border-[#9ecfff]/20 bg-[#0f172a]/90 backdrop-blur-sm"
                >
                  <h4 className="font-orbitron text-white mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                  {!badgeState.earned && (
                    <p className="text-xs text-gray-500 italic">Continue your journey to unlock this badge</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="flex flex-col items-center justify-center p-10 mt-8 border border-[#9ecfff]/20 bg-[#0f172a]/80 backdrop-blur-sm rounded-md">
          <div className="w-20 h-20 rounded-full bg-[#1e2535]/70 border-2 border-[#9ecfff]/20 flex items-center justify-center mb-4">
            <span className="text-4xl font-orbitron text-gray-600">?</span>
          </div>
          <h3 className="text-xl font-orbitron text-gray-300 mb-2">No Badges Found</h3>
          <p className="text-gray-500 text-center max-w-md">
            No badges match your current filters. Try adjusting your category or rarity filters to explore more badges.
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgePage;