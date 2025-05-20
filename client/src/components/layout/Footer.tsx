import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-[#0c1527]/70 border-t border-[#1e293b] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © 2025 KOD•X WORLD | Digital mindfulness and security
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/about">
              <span className="text-sm text-gray-400 hover:text-[#9ecfff] cursor-pointer">
                About
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-gray-400 hover:text-[#9ecfff] cursor-pointer">
                Privacy
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-sm text-gray-400 hover:text-[#9ecfff] cursor-pointer">
                Terms
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-sm text-gray-400 hover:text-[#9ecfff] cursor-pointer">
                Contact
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}