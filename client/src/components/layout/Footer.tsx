import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] mt-8 py-6 bg-[#0c1527]/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-orbitron text-lg tracking-wider bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">
              KOD<span className="text-[#9ecfff]">•</span>X
            </span>
            <p className="text-sm text-gray-400 mt-2">
              Elevate your digital mindfulness and security skills
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/about">
              <span className="text-sm text-gray-400 hover:text-white transition-colors">About</span>
            </Link>
            <Link href="/labs">
              <span className="text-sm text-gray-400 hover:text-white transition-colors">Labs</span>
            </Link>
            <Link href="/projects">
              <span className="text-sm text-gray-400 hover:text-white transition-colors">Projects</span>
            </Link>
            <Link href="/forum">
              <span className="text-sm text-gray-400 hover:text-white transition-colors">Forum</span>
            </Link>
            <Link href="/resources">
              <span className="text-sm text-gray-400 hover:text-white transition-colors">Resources</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-[#1e293b] text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} KOD•X WORLD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}