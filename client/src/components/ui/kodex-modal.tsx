import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface KodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function KodexModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}: KodexModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Handle escape key to close
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);
  
  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    full: "max-w-none w-full h-full rounded-none",
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className={cn(
          "relative flex flex-col bg-[#0e1424]/95 border border-[#9ecfff]/20 shadow-lg",
          "rounded-lg overflow-hidden animate-in fade-in-50 duration-300",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#9ecfff]/10">
          {title && (
            <h2 className="font-orbitron text-lg tracking-wider">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center rounded-full w-8 h-8 transition-colors hover:bg-[#9ecfff]/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}