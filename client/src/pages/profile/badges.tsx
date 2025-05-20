import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  BADGE_CATEGORY_COLORS, 
  BADGE_RARITY_EFFECTS,
  BADGES,
  type BadgeCategory,
  type BadgeRarity
} from '@shared/constants/badges';
import { Card } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function BadgesPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | BadgeCategory>('all');
  const [activeRarity, setActiveRarity] = useState<'all' | BadgeRarity>('all');
  
  // Fetch user badges
  const { data: userBadges = [], isLoading } = useQuery({
    queryKey: ['/api/user-badges'],
    enabled: isAuthenticated,
  });
  
  // Calculate badge stats
  const totalBadges = BADGES.length;
  const earnedBadges = Array.isArray(userBadges) ? userBadges.length : 0;
  const earnedPercentage = Math.round((earnedBadges / totalBadges) * 100);
  
  // Format badge earned date
  const formatEarnedDate = (timestamp: string) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  };
  
  // Filter badges by category and rarity
  const filteredBadges = BADGES.filter(badge => {
    const categoryMatch = activeCategory === 'all' || badge.category === activeCategory;
    const rarityMatch = activeRarity === 'all' || badge.rarity === activeRarity;
    return categoryMatch && rarityMatch;
  });
  
  // Check if a badge is earned
  const isBadgeEarned = (badgeId: string) => {
    return Array.isArray(userBadges) && userBadges.some((b: any) => b.id === badgeId);
  };
  
  // Get badge status and timestamp
  const getBadgeStatus = (badgeId: string) => {
    if (!Array.isArray(userBadges)) return { earned: false, timestamp: null };
    
    const foundBadge = userBadges.find((b: any) => b.id === badgeId);
    return {
      earned: !!foundBadge,
      timestamp: foundBadge?.timestampEarned || null
    };
  };
  
  // Badge categories for filter
  const categories: { value: 'all' | BadgeCategory; label: string; color: string }[] = [
    { value: 'all', label: 'All Categories', color: 'text-white' },
    { value: 'labs', label: 'Labs', color: 'text-indigo-400' },
    { value: 'projects', label: 'Projects', color: 'text-cyan-400' },
    { value: 'community', label: 'Community', color: 'text-green-400' },
    { value: 'security', label: 'Security', color: 'text-red-400' },
    { value: 'creativity', label: 'Creativity', color: 'text-pink-400' },
    { value: 'mindful-tech', label: 'Mindful Tech', color: 'text-emerald-400' },
    { value: 'leveling', label: 'Leveling', color: 'text-amber-400' },
    { value: 'reflection', label: 'Reflection', color: 'text-indigo-400' },
    { value: 'meta', label: 'Platform', color: 'text-purple-400' },
    { value: 'quirky', label: 'Quirky', color: 'text-fuchsia-400' },
  ];
  
  // Badge rarities for filter
  const rarities: { value: 'all' | BadgeRarity; label: string; color: string }[] = [
    { value: 'all', label: 'All Rarities', color: 'text-white' },
    { value: 'common', label: 'Common', color: 'text-gray-300' },
    { value: 'uncommon', label: 'Uncommon', color: 'text-blue-400' },
    { value: 'rare', label: 'Rare', color: 'text-purple-400' },
    { value: 'epic', label: 'Epic', color: 'text-pink-400' },
    { value: 'legendary', label: 'Legendary', color: 'text-amber-400' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-orbitron text-white mb-2">
          Badge System
        </h1>
        <p className="text-gray-400 max-w-3xl">
          Badges represent your achievements on KOD𝛯X. Earn them by completing labs, 
          projects, engaging with the community, and demonstrating your growth.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 border border-[#9ecfff]/20 bg-[#0f172a]/70">
          <h3 className="text-lg font-orbitron text-white mb-2">Your Progress</h3>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-orbitron text-blue-300">{earnedBadges}/{totalBadges}</span>
            <span className="text-gray-400 text-sm">{earnedPercentage}% Complete</span>
          </div>
          <Progress value={earnedPercentage} className="h-2 mb-4" />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400">Latest:</p>
              <p className="text-white truncate">
                {Array.isArray(userBadges) && userBadges.length > 0 
                  ? userBadges[0].name 
                  : 'None yet'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Rarest:</p>
              <p className="text-amber-400 truncate">
                {Array.isArray(userBadges) && userBadges.length > 0
                  ? userBadges.filter((b: any) => b.rarity === 'legendary')[0]?.name ||
                    userBadges.filter((b: any) => b.rarity === 'epic')[0]?.name ||
                    userBadges.filter((b: any) => b.rarity === 'rare')[0]?.name ||
                    userBadges.filter((b: any) => b.rarity === 'uncommon')[0]?.name ||
                    userBadges.filter((b: any) => b.rarity === 'common')[0]?.name ||
                    'None yet'
                  : 'None yet'}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-[#9ecfff]/20 bg-[#0f172a]/70">
          <h3 className="text-lg font-orbitron text-white mb-2">Badge Rarities</h3>
          <div className="space-y-2">
            {rarities.slice(1).map(rarity => (
              <div key={rarity.value} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: rarity.color === 'text-gray-300' ? '#d1d5db' :
                                       rarity.color === 'text-blue-400' ? '#60a5fa' :
                                       rarity.color === 'text-purple-400' ? '#a78bfa' :
                                       rarity.color === 'text-pink-400' ? '#f472b6' :
                                       rarity.color === 'text-amber-400' ? '#fbbf24' : '#fff'
                    }}
                  />
                  <span className={rarity.color}>{rarity.label}</span>
                </div>
                <span className="text-gray-400">
                  {Array.isArray(userBadges) ? 
                    userBadges.filter((b: any) => b.rarity === rarity.value).length : 0}/
                  {BADGES.filter(b => b.rarity === rarity.value).length}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 border border-[#9ecfff]/20 bg-[#0f172a]/70">
          <h3 className="text-lg font-orbitron text-white mb-2">Badge Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(1).map(category => (
              <Badge 
                key={category.value}
                className={`
                  ${BADGE_CATEGORY_COLORS[category.value === 'all' ? 'labs' : category.value].bg} 
                  ${BADGE_CATEGORY_COLORS[category.value === 'all' ? 'labs' : category.value].text} 
                  flex items-center justify-between py-1 px-2
                `}
              >
                <span>{category.label}</span>
                <span className="ml-1 opacity-70">
                  {Array.isArray(userBadges) ? 
                    userBadges.filter((b: any) => b.category === category.value).length : 0}
                </span>
              </Badge>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveCategory('all')}
              className="text-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="earned" 
              onClick={() => {}}
              className="text-sm"
            >
              Earned
            </TabsTrigger>
            <TabsTrigger 
              value="locked" 
              onClick={() => {}}
              className="text-sm"
            >
              Locked
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select onValueChange={(value) => setActiveCategory(value as any)} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Badge category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                  className={category.color}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setActiveRarity(value as any)} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Badge rarity" />
            </SelectTrigger>
            <SelectContent>
              {rarities.map(rarity => (
                <SelectItem 
                  key={rarity.value} 
                  value={rarity.value}
                  className={rarity.color}
                >
                  {rarity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredBadges.map(badge => {
          const badgeStatus = getBadgeStatus(badge.id);
          const rarityEffect = BADGE_RARITY_EFFECTS[badge.rarity];
          
          // Create the badge glow color based on the category
          const categoryColor = BADGE_CATEGORY_COLORS[badge.category];
          const gradientColor = categoryColor.gradient || 'rgba(158, 207, 255, 0.3)';
          
          return (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className={`p-4 flex flex-col items-center justify-center h-40 bg-[#0f172a]/70 border transition-all
                      ${badgeStatus.earned ? 'hover:scale-105' : 'opacity-60 hover:opacity-80'}`}
                    style={{
                      boxShadow: badgeStatus.earned ? rarityEffect.glow : 'none',
                      borderColor: badgeStatus.earned ? rarityEffect.borderColor : 'rgba(30, 41, 59, 0.7)',
                      animation: badgeStatus.earned ? rarityEffect.animation : 'none'
                    }}
                  >
                    {/* Badge Icon */}
                    <div 
                      className="w-16 h-16 rounded-full bg-[#1e2535]/70 border flex items-center justify-center mb-2"
                      style={{
                        borderColor: badgeStatus.earned ? gradientColor : 'rgba(30, 41, 59, 0.7)',
                        boxShadow: badgeStatus.earned ? `0 0 8px ${gradientColor}` : 'none'
                      }}
                    >
                      <span className={`text-2xl font-orbitron ${categoryColor.text}`}>
                        {badge.name.charAt(0)}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-orbitron text-center text-white mb-1 line-clamp-1">
                      {badge.name}
                    </h3>
                    
                    <Badge className={`${categoryColor.bg} ${categoryColor.text} text-xs truncate max-w-full`}>
                      {badge.category}
                    </Badge>
                  </Card>
                </TooltipTrigger>
                
                <TooltipContent 
                  side="right"
                  className="max-w-xs border border-[#9ecfff]/20 bg-[#0f172a]/90 backdrop-blur-sm"
                >
                  <h4 className="font-orbitron text-white mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <Badge className={`${categoryColor.bg} ${categoryColor.text} text-xs`}>
                      {badge.category}
                    </Badge>
                    <Badge className="bg-[#1e2535] text-xs capitalize">
                      {badge.rarity}
                    </Badge>
                  </div>
                  
                  {badgeStatus.earned && badgeStatus.timestamp ? (
                    <p className="text-xs text-blue-300 mt-2">
                      Earned {formatEarnedDate(badgeStatus.timestamp)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">Not yet earned</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}