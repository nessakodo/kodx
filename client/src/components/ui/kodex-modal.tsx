import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface KodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "right";
}

export function KodexModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "md",
  position = "center"
}: KodexModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Handle escape key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl w-full"
  };

  // Position classes
  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-20",
    right: "items-center justify-end pr-4"
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain">
      <div className={cn("fixed inset-0 z-50 flex", positionClasses[position])}>
        <div
          ref={modalRef}
          className={cn(
            "kodex-modal relative w-full m-4 rounded-lg border border-[#9ecfff]/20 bg-[#0a0d14]/90 backdrop-blur-md text-white shadow-2xl transition-all",
            sizeClasses[size],
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-5",
            position === "right" ? "h-full max-h-screen rounded-l-lg rounded-r-none" : ""
          )}
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 -z-10 rounded-lg opacity-50 blur-[2px] bg-gradient-to-r from-[#9ecfff]/10 to-[#88c9b7]/10"></div>
          
          {/* Top grid lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9ecfff]/5 via-[#88c9b7]/5 to-[#9ecfff]/5"></div>
          
          {/* Left grid lines */}
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#9ecfff]/5 via-[#88c9b7]/5 to-[#9ecfff]/5"></div>
          
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-[#1e293b] px-6 py-4">
              {title && (
                <h2 className="font-orbitron tracking-wider text-lg">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9ecfff]/50 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#1e293b]/50 h-9 w-9"
                  onClick={onClose}
                >
                  <X className="h-4 w-4 text-[#9ecfff]/70" />
                </button>
              )}
            </div>
          )}
          
          {/* Modal content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}