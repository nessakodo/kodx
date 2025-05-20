import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ONBOARDING_STEPS } from '@shared/constants/onboarding';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  isOpen,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Reset to first step when modal opens
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const step = ONBOARDING_STEPS[currentStep];
  
  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      onComplete();
    }
  };
  
  const handleActionClick = () => {
    // Handle navigation based on action (optional)
    switch (step.action) {
      case "Explore Labs":
        onComplete();
        setLocation('/labs');
        break;
      case "See Projects":
        onComplete();
        setLocation('/projects');
        break;
      case "Visit Forum":
        onComplete();
        setLocation('/forum');
        break;
      case "View Resources":
        onComplete();
        setLocation('/resources');
        break;
      default:
        handleNext();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="animate-fade-in relative max-w-lg w-full rounded-xl overflow-hidden">
        {/* Cyber-zen background with layered effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#0f1729] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjJlNDkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20 z-1"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#9ecfff]/5 via-transparent to-transparent z-2"></div>
        
        {/* Glowing border */}
        <div className="absolute inset-0 rounded-xl border border-[#9ecfff]/30 z-3 
          shadow-[0_0_15px_rgba(158,207,255,0.1)]"></div>
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Progress indicator */}
          <div className="w-full flex items-center justify-between mb-6">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-gray-400 text-sm">
              {currentStep + 1}/{ONBOARDING_STEPS.length}
            </span>
          </div>
          
          {/* Content */}
          <div className="mb-8">
            <h2 className="font-orbitron text-2xl text-[#9ecfff] mb-3">{step.title}</h2>
            <p className="text-gray-300">{step.body}</p>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center">
            {step.skippable ? (
              <button 
                onClick={onSkip}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Skip Tour
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            <button
              onClick={handleActionClick}
              className="relative overflow-hidden px-6 py-2.5 rounded-lg font-medium 
                text-white transition-all duration-300
                bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90"
            >
              {/* Subtle glow behind button */}
              <span className="absolute inset-0 flex justify-center items-center blur-sm opacity-50 bg-[#9ecfff]"></span>
              
              {/* Button content */}
              <span className="relative z-10">{step.action}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};