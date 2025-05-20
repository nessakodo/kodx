import React from 'react';
import { Link } from 'wouter';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-orbitron mb-4 text-white">404</h1>
          <h2 className="text-xl mb-6 text-gray-300">Page not found</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button 
              variant="default"
              className="bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 text-[#9ecfff] border border-[#9ecfff]/30"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}