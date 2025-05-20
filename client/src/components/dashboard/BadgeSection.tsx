import React, { useState } from 'react';
import { Link } from 'wouter';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { EmptyBadgesState } from './EmptyStates';
import { BadgeModal } from '../modals/BadgeModal';
import { 
  type Badge,
  BADGE_CATEGORY_COLORS,
  BADGE_RARITY_EFFECTS,
  type BadgeCategory
} from '@shared/constants/badges';

interface BadgeSectionProps {
  badges: Badge[];
  isLoading: boolean;
}

export function BadgeSection({ badges = [], isLoading }: BadgeSectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');
  
  // Filter badges by category
  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory);
  
  // Show badge modal
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setBadgeModalOpen(true);
  };
  
  // Get total count by category
  const getCategoryCount = (category: BadgeCategory | 'all') => {
    if (category === 'all') return badges.length;
    return badges.filter(badge => badge.category === category).length;
  };
  
  // Format date to show how long ago a badge was earned
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-purple-300">
          Your Badges
        </h2>
        
        <Link href="/profile/badges">
          <Button variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
            View All Badges
          </Button>
        </Link>
      </div>
      
      {/* Category filter tabs */}
      <div className="flex mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {(['all', 'achievement', 'learning', 'community', 'security', 'wellbeing'] as const).map(category => {
          const count = getCategoryCount(category);
          const colors = category === 'all' 
            ? { bg: 'bg-purple-500/10', text: 'text-purple-300' }
            : { 
                bg: `${BADGE_CATEGORY_COLORS[category].bg}`, 
                text: `${BADGE_CATEGORY_COLORS[category].text}` 
              };
          
          return (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className={`mr-2 rounded-full px-4 ${
                activeCategory === category 
                  ? `${colors.bg} ${colors.text} border border-purple-500/30` 
                  : 'bg-transparent text-gray-400 hover:bg-purple-500/5 hover:text-purple-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'All' : category}
              {count > 0 && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category ? 'bg-purple-800/50' : 'bg-[#1e293b]'
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#1e293b]/50 animate-pulse mb-2" />
                <div className="h-4 bg-[#1e293b]/50 rounded w-20 animate-pulse mb-1" />
                <div className="h-3 bg-[#1e293b]/50 rounded w-16 animate-pulse" />
              </div>
            ))}
          </div>
        </Card>
      ) : filteredBadges.length > 0 ? (
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.slice(0, 8).map(badge => {
              const categoryColors = BADGE_CATEGORY_COLORS[badge.category];
              const rarityEffects = BADGE_RARITY_EFFECTS[badge.rarity];
              
              return (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="flex flex-col items-center group"
                        onClick={() => handleBadgeClick(badge)}
                      >
                        {/* Badge icon */}
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 group-hover:scale-110 transition-all duration-300"
                          style={{ 
                            borderColor: rarityEffects.borderColor,
                            boxShadow: rarityEffects.glow,
                            background: `radial-gradient(circle, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)`
                          }}
                        >
                          <span 
                            className={`text-2xl font-orbitron ${categoryColors.text}`}
                            style={{ textShadow: `0 0 10px ${categoryColors.gradient}` }}
                          >
                            {badge.name.charAt(0)}
                          </span>
                        </div>
                        
                        {/* Badge name */}
                        <h3 className="text-sm font-medium text-white text-center mb-1">
                          {badge.name}
                        </h3>
                        
                        {/* Badge category */}
                        <BadgeUI className={`${categoryColors.bg} ${categoryColors.text} text-xs`}>
                          {badge.category}
                        </BadgeUI>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-[#0f172a] border-[#1e293b] p-3 max-w-xs"
                    >
                      <p className="font-medium text-white mb-1">{badge.name}</p>
                      <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <BadgeUI className={`${categoryColors.bg} ${categoryColors.text}`}>
                          {badge.category}
                        </BadgeUI>
                        <span className="text-gray-400 capitalize">
                          {badge.rarity} · {badge.createdAt && formatTimeAgo(badge.createdAt)}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          {filteredBadges.length > 8 && (
            <div className="text-center mt-6">
              <Link href="/profile/badges">
                <Button 
                  variant="link" 
                  className="text-purple-300 hover:text-purple-200"
                >
                  Show All ({filteredBadges.length}) Badges
                </Button>
              </Link>
            </div>
          )}
        </Card>
      ) : (
        <EmptyBadgesState />
      )}
      
      {/* Badge modal */}
      <BadgeModal
        badge={selectedBadge}
        open={badgeModalOpen}
        onOpenChange={setBadgeModalOpen}
      />
    </section>
  );
}