import React from 'react';
import { Link } from 'wouter';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { SimpleDashboard } from '@/components/dashboard/SimpleDashboard';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <MainLayout>
      {isAuthenticated ? (
        <SimpleDashboard />
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-orbitron tracking-wider text-white mb-6">
              <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">
                KOD•X WORLD
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              Elevate your digital mindfulness and security skills through immersive learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/api/login">
                <Button
                  size="lg"
                  className="bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 text-[#9ecfff] border border-[#9ecfff]/30"
                >
                  Sign in to begin
                </Button>
              </Link>
              <Link href="/labs">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-[#9ecfff]/30 text-white hover:bg-[#1e293b]/70"
                >
                  Explore Labs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}