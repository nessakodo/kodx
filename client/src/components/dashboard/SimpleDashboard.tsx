import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';

export function SimpleDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Banner */}
      <div className="mb-10 p-6 rounded-lg bg-gradient-to-r from-[#0c1527]/80 to-[#1e293b]/60 border border-[#1e293b] shadow-glow-sm">
        <h1 className="text-2xl md:text-3xl font-orbitron tracking-wider mb-3">
          Welcome back, <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">{user?.username || 'Explorer'}</span>
        </h1>
        <p className="text-gray-300 mb-6 max-w-2xl">
          Continue your journey of digital enlightenment. Explore labs, complete projects, 
          and connect with the community to advance your skills.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard">
            <Button className="bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 text-[#9ecfff]">
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/labs">
            <Button variant="outline" className="border-[#9ecfff]/30 text-white hover:bg-[#1e293b]/70">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Labs
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recommended For You Section */}
      <div className="mb-10">
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
            {[
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
            ].map((item) => (
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
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 shadow-glow-sm p-6">
          <h3 className="text-xl font-orbitron mb-4 text-indigo-300">Labs</h3>
          <p className="text-gray-300 mb-4">Interactive learning sessions to enhance your skills.</p>
          <Link href="/labs">
            <Button className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300">
              View Labs
            </Button>
          </Link>
        </Card>
        
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 shadow-glow-sm p-6">
          <h3 className="text-xl font-orbitron mb-4 text-cyan-300">Projects</h3>
          <p className="text-gray-300 mb-4">Build practical applications with guided instructions.</p>
          <Link href="/projects">
            <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300">
              View Projects
            </Button>
          </Link>
        </Card>
        
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 shadow-glow-sm p-6">
          <h3 className="text-xl font-orbitron mb-4 text-violet-300">Community</h3>
          <p className="text-gray-300 mb-4">Connect with peers and join discussions.</p>
          <Link href="/forum">
            <Button className="w-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-300">
              View Forum
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}