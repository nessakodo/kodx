import React, { useState } from 'react';
import { Badge } from '@shared/constants/badges';
import { BADGE_CATEGORY_COLORS, BADGE_RARITY_EFFECTS } from '@shared/constants/badges';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showUnlockAnimation?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  size = 'md',
  onClick,
  showUnlockAnimation = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  // Get category color
  const categoryColor = BADGE_CATEGORY_COLORS[badge.category] || 'bg-gray-500';
  
  // Get rarity effect
  const rarityEffect = BADGE_RARITY_EFFECTS[badge.rarity] || '';
  
  // Handle click
  const handleClick = () => {
    setShowDetails(!showDetails);
    if (onClick) onClick();
  };
  
  return (
    <>
      <div className="relative group">
        {/* Badge container */}
        <div 
          className={`relative ${sizeClasses[size]} rounded-full p-1 cursor-pointer transition-all duration-500 
            ${rarityEffect} overflow-hidden hover:scale-105 flex items-center justify-center
            ${showUnlockAnimation ? 'animate-badge-unlock' : ''}
            ${badge.timestampEarned ? 'opacity-100' : 'opacity-50 grayscale'}`}
          onClick={handleClick}
        >
          {/* Badge background with category color */}
          <div className={`absolute inset-0 ${categoryColor} opacity-30 rounded-full`}></div>
          
          {/* Glow effects */}
          {(badge.rarity === 'epic' || badge.rarity === 'legendary') && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-yellow-500/20 rounded-full blur-md"></div>
          )}
          
          {/* Badge icon - would be replaced by actual icon in production */}
          <div className="relative z-10 flex items-center justify-center h-full w-full rounded-full bg-gray-900/80">
            {/* Badge letter (placeholder for the icon) */}
            <span className="text-white font-bold">{badge.name.charAt(0)}</span>
          </div>
          
          {/* Locked indicator */}
          {!badge.timestampEarned && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900/90 text-white text-xs rounded px-2 py-1 pointer-events-none z-30 w-40 -left-12 top-full mt-2">
          <div className="font-medium">{badge.name}</div>
          <div className="text-xs text-gray-300 mt-1">{badge.description}</div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-400">{badge.category}</span>
            <span className={`text-xs ${badge.rarity === 'legendary' ? 'text-amber-400' : badge.rarity === 'epic' ? 'text-purple-400' : 'text-gray-400'}`}>
              {badge.rarity}
            </span>
          </div>
        </div>
      </div>
      
      {/* Badge details modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="relative bg-gradient-to-b from-[#0f172a] to-[#0f1729] border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-xl">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowDetails(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              {/* Badge display */}
              <div className={`${sizeClasses.lg} rounded-full p-2 mb-6 ${rarityEffect} ${categoryColor} opacity-80`}>
                <div className="h-full w-full rounded-full bg-gray-900/80 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{badge.name.charAt(0)}</span>
                </div>
              </div>
              
              {/* Badge details */}
              <h2 className="text-xl font-medium text-white mb-2">{badge.name}</h2>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mb-4 bg-gray-800 text-gray-300">
                {badge.category} • {badge.rarity}
              </div>
              
              <p className="text-gray-300 mb-4 text-center italic">
                "{badge.description}"
              </p>
              
              {badge.timestampEarned && (
                <div className="text-sm text-gray-400 mb-4">
                  Earned on {new Date(badge.timestampEarned).toLocaleDateString()}
                </div>
              )}
              
              {!badge.timestampEarned && (
                <div className="text-sm text-gray-400 mb-4">
                  Keep exploring to unlock this badge!
                </div>
              )}
              
              <button
                className="mt-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const BadgeUnlockModal: React.FC<{
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
}> = ({ badge, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="relative bg-gradient-to-b from-[#0f172a] to-[#0f1729] border border-[#9ecfff]/30 rounded-2xl p-8 max-w-md w-full shadow-xl">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          {/* Badge with unlock animation */}
          <BadgeDisplay badge={badge} size="lg" showUnlockAnimation={true} />
          
          <h2 className="text-2xl font-orbitron text-[#9ecfff] mb-2 mt-6">
            New Badge Unlocked!
          </h2>
          <h3 className="text-xl font-medium text-white mb-4">
            {badge.name}
          </h3>
          <p className="text-gray-300 mb-6 text-center italic">
            "{badge.description}"
          </p>
          
          <button
            className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            Reflect & Share
          </button>
        </div>
      </div>
    </div>
  );
};