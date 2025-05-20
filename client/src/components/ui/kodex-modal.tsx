import React, { ReactNode, useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "full";
  showCloseButton?: boolean;
  position?: {
    element?: HTMLElement;
    placement?: "top" | "bottom" | "left" | "right";
    offset?: number;
  };
  children: React.ReactNode;
  className?: string;
}

export function KodexModal({
  isOpen,
  onClose,
  title,
  size = "md",
  showCloseButton = true,
  position,
  children,
  className,
}: KodexModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Size classes based on the size prop
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    full: "max-w-[95vw] sm:max-w-[90vw] h-[90vh]",
  };
  
  useEffect(() => {
    setMounted(true);
    
    // Add ESC key listener for closing the modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);
  
  // Calculate position based on the trigger element
  const getPositionStyles = () => {
    if (!position?.element || !mounted) return {};
    
    const rect = position.element.getBoundingClientRect();
    const offset = position.offset || 8;
    
    switch (position.placement) {
      case "top":
        return {
          bottom: `${window.innerHeight - rect.top + offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)",
        };
      case "right":
        return {
          left: `${rect.right + offset}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          right: `${window.innerWidth - rect.left + offset}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        };
      case "bottom":
      default:
        return {
          top: `${rect.bottom + offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)",
        };
    }
  };
  
  if (!mounted) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex ${
        position ? "items-start" : "items-center"
      } justify-center ${isOpen ? "visible" : "invisible"}`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay - lighter for positioned modals */}
      <div
        className={`fixed inset-0 ${position ? 'bg-black/20' : 'bg-black/50'} ${
          isOpen ? "animate-in fade-in-0" : "animate-out fade-out-0"
        } transition-opacity duration-200`}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div
        ref={modalRef}
        className={cn(
          "kodex-modal",
          sizeClasses[size],
          "w-full max-h-[90vh] overflow-auto flex flex-col",
          "transition-all duration-200",
          isOpen
            ? "animate-in fade-in-0 zoom-in-95"
            : "animate-out fade-out-0 zoom-out-95",
          position ? "absolute bg-[#0f172a]/95 backdrop-blur-sm border border-[#9ecfff]/15 rounded-lg shadow-lg" : "relative",
          className
        )}
        style={position ? getPositionStyles() : {}}
      >
        {/* Modal header */}
        <div className="kodex-modal-header flex items-center justify-between">
          <h2 className="text-lg font-orbitron text-white">{title}</h2>
          {showCloseButton && (
            <button
              className="kodex-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Modal body */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}