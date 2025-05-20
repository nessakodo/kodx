import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { SendIcon, MessageSquareIcon, TagIcon, HeartIcon, PlusIcon, ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { TRENDING_TAGS } from "@/lib/mockData";

interface ForumSidebarProps {
  onTagSelect?: (tag: string) => void;
  selectedTags?: string[];
}

export function ForumSidebar({ onTagSelect, selectedTags = [] }: ForumSidebarProps) {
  const [email, setEmail] = useState("");
  const [location] = useLocation();

  const featuredPost = {
    id: 1,
    title: "From Quantum Confusion to Clarity: A Beginner's Map",
    author: "quantumOracle",
    comments: 19,
    likes: 138
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the email to your newsletter API
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Newsletter Sign Up */}
      <GlassmorphicCard className="p-6">
        <h3 className="text-xl font-orbitron text-white mb-4">Join Our Newsletter</h3>
        <p className="text-gray-400 text-sm mb-4">
          Get weekly insights on cyber security, ethical tech, and mindful computing.
        </p>
        <form onSubmit={handleNewsletterSignup} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50 focus:ring-0"
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-[#1e293b]/70 hover:bg-[#1e293b] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-[#9ecfff]"
          >
            Subscribe <SendIcon className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </GlassmorphicCard>

      {/* Featured Post */}
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-orbitron text-white">Featured Post</h3>
          <Badge className="bg-[#bb86fc]/10 text-[#bb86fc] border border-[#bb86fc]/30">
            Hot
          </Badge>
        </div>
        <h4 className="text-md font-medium text-white mb-2">{featuredPost.title}</h4>
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <span>By {featuredPost.author}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <MessageSquareIcon className="mr-1 h-4 w-4 text-[#9ecfff]" />
            {featuredPost.comments}
          </div>
          <div className="flex items-center">
            <HeartIcon className="mr-1 h-4 w-4 text-rose-500" />
            {featuredPost.likes}
          </div>
        </div>
        <Link href="/forum/post/1">
          <Button 
            className="w-full bg-[#1e293b]/70 hover:bg-[#1e293b] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white text-xs"
            size="sm"
          >
            Read More
          </Button>
        </Link>
      </GlassmorphicCard>

      {/* Trending Tags */}
      <GlassmorphicCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TagIcon className="h-5 w-5 text-[#56ccf2]" />
          <h3 className="text-xl font-orbitron text-white">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map(tag => {
            const isSelected = selectedTags.includes(tag.label);
            return (
              <Badge 
                key={tag.label}
                onClick={() => onTagSelect && onTagSelect(tag.label)}
                className={`py-1 px-3 ${
                  isSelected 
                    ? "bg-[#1e293b] text-[#9ecfff] border-[#9ecfff]/60" 
                    : "bg-[#1e293b]/70 text-white border-[#9ecfff]/20 hover:border-[#9ecfff]/40"
                } border cursor-pointer transition-all`}
              >
                {isSelected && <PlusIcon className="h-3 w-3 mr-1 rotate-45" />}
                {tag.label} <span className="ml-1 text-gray-400">({tag.count})</span>
              </Badge>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-gray-400">
          <p>Click tags to filter. Select multiple for more specific results.</p>
        </div>
      </GlassmorphicCard>
    </div>
  );
}