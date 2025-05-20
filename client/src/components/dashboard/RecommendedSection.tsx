import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock data for recommended items (in a real app, this would come from the API)
const recommendedItems = [
  {
    id: 1,
    type: 'Lab',
    title: 'Neural Network Foundations',
    description: 'Build a simple neural network from scratch and understand the math behind it.',
    xpValue: 750,
    difficultyLevel: 'Intermediate'
  },
  {
    id: 2,
    type: 'Project',
    title: 'Decentralized AI Marketplace',
    description: 'Build a platform for trading AI models on a decentralized network.',
    xpValue: 1500,
    difficultyLevel: 'Advanced'
  },
  {
    id: 3,
    type: 'Discussion',
    title: 'Balancing Tech & Mindfulness',
    description: 'Join the discussion on techniques for maintaining mindfulness while coding.',
    xpValue: 250,
    difficultyLevel: undefined
  }
];

export function RecommendedSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-orbitron tracking-wider">
          <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">
            Recommended For You
          </span>
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-[#9ecfff]/30 bg-[#1e293b]/30 hover:bg-[#1e293b]/60"
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedItems.map((item) => (
          <Card 
            key={item.id} 
            className="border border-[#1e293b] bg-[#0c1527]/50 shadow-glow-sm overflow-hidden"
          >
            <div className="flex flex-col h-full p-5">
              <div className="flex justify-between mb-6">
                <div className={`px-2 py-1 text-xs rounded ${
                  item.type === 'Lab' 
                    ? 'bg-indigo-500/20 text-indigo-300' 
                    : item.type === 'Project' 
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-violet-500/20 text-violet-300'
                }`}>
                  {item.type}
                </div>
                
                {item.difficultyLevel && (
                  <div className="px-2 py-1 text-xs rounded bg-[#1e293b]/70">
                    {item.difficultyLevel}
                  </div>
                )}
              </div>
              
              <h3 className="text-base font-medium mb-2 text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-grow">
                {item.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <div className="text-sm text-[#9ecfff]">
                  {item.xpValue} XP
                </div>
                <Button 
                  size="sm" 
                  className={`${
                    item.type === 'Lab' 
                      ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300' 
                      : item.type === 'Project' 
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300'
                        : 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-300'
                  }`}
                >
                  {item.type === 'Discussion' ? 'Join Discussion' : `Start ${item.type}`}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}