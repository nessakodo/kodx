import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { EmptyBadgesState } from './EmptyStates';
import { Badge as BadgeType, BADGE_CATEGORY_COLORS } from '@shared/constants/badges';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function BadgeSection() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch user badges
  const { data: userBadges = [] } = useQuery({
    queryKey: ['/api/user-badges'],
    enabled: isAuthenticated,
  });
  
  // Format badge earned date
  const formatEarnedDate = (timestamp: string) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  };
  
  // Get badge styles & colors
  const getBadgeStyle = (badge: BadgeType) => {
    const categoryColor = BADGE_CATEGORY_COLORS[badge.category];
    const textColor = categoryColor?.text || 'text-white';
    
    return {
      borderColor: `var(--${badge.category}-color, rgba(158, 207, 255, 0.2))`,
      textColor: textColor
    };
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-purple-300">Achievement Badges</h2>
        
        <Link href="/profile/badges">
          <Button variant="outline" 
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
            Badge System
          </Button>
        </Link>
      </div>
      
      {userBadges.length > 0 ? (
        <div>
          {/* Recent badges carousel */}
          <div className="overflow-x-auto hide-scrollbar pb-4">
            <div className="flex space-x-4">
              {userBadges.map((badge: BadgeType) => {
                const styles = getBadgeStyle(badge);
                
                return (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card 
                          className="flex-shrink-0 p-4 flex flex-col items-center justify-center w-32 h-40 border bg-[#0f172a]/70 hover:bg-[#1e2535]/40 transition-colors"
                          style={{ borderColor: styles.borderColor }}
                        >
                          {/* Badge Icon */}
                          <div className="w-16 h-16 rounded-full bg-[#1e2535]/70 border border-[#9ecfff]/20 flex items-center justify-center mb-2">
                            <span className={`text-2xl font-orbitron ${styles.textColor}`}>
                              {badge.name.charAt(0)}
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-orbitron text-center text-white mb-1 line-clamp-1">
                            {badge.name}
                          </h3>
                          
                          <Badge className={`${BADGE_CATEGORY_COLORS[badge.category].bg} ${BADGE_CATEGORY_COLORS[badge.category].text} text-xs truncate max-w-full`}>
                            {badge.category}
                          </Badge>
                        </Card>
                      </TooltipTrigger>
                      
                      <TooltipContent 
                        side="bottom"
                        className="max-w-xs border border-[#9ecfff]/20 bg-[#0f172a]/90 backdrop-blur-sm"
                      >
                        <h4 className="font-orbitron text-white mb-1">{badge.name}</h4>
                        <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                        {badge.timestampEarned && (
                          <p className="text-xs text-gray-500">Earned {formatEarnedDate(badge.timestampEarned)}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
          
          {/* Badge stats summary */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border border-[#9ecfff]/20 bg-[#0f172a]/70">
              <h4 className="text-xs text-gray-400 mb-1">Total Badges</h4>
              <p className="text-xl font-orbitron text-white">{userBadges.length}</p>
            </Card>
            
            <Card className="p-4 border border-[#9ecfff]/20 bg-[#0f172a]/70">
              <h4 className="text-xs text-gray-400 mb-1">Rarest Badge</h4>
              <p className="text-xl font-orbitron text-amber-400">
                {userBadges.find((b: BadgeType) => b.rarity === "legendary")?.name || 
                 userBadges.find((b: BadgeType) => b.rarity === "epic")?.name ||
                 userBadges.find((b: BadgeType) => b.rarity === "rare")?.name ||
                 userBadges.find((b: BadgeType) => b.rarity === "uncommon")?.name ||
                 userBadges.find((b: BadgeType) => b.rarity === "common")?.name || 
                 "None"}
              </p>
            </Card>
            
            <Card className="p-4 border border-[#9ecfff]/20 bg-[#0f172a]/70">
              <h4 className="text-xs text-gray-400 mb-1">Latest Badge</h4>
              <p className="text-xl font-orbitron text-white line-clamp-1">
                {userBadges[0]?.name || "None"}
              </p>
            </Card>
            
            <Card className="p-4 border border-[#9ecfff]/20 bg-[#0f172a]/70">
              <h4 className="text-xs text-gray-400 mb-1">Most Common</h4>
              <p className="text-xl font-orbitron text-white">
                {Object.entries(userBadges.reduce((acc: any, badge: BadgeType) => {
                  acc[badge.category] = (acc[badge.category] || 0) + 1;
                  return acc;
                }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyBadgesState />
      )}
    </section>
  );
}