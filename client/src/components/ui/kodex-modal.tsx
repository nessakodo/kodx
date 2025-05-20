import React, { useState, useEffect, useRef } from "react";
import { XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function KodexModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true 
}: KodexModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Close on ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="kodex-modal relative w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="kodex-modal-header font-orbitron">
              <h2 className="text-lg text-gray-200">{title}</h2>
            </div>
            
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="kodex-modal-close"
                aria-label="Close modal"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
            
            <div className="mt-2">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}