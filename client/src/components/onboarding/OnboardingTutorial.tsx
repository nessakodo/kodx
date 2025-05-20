import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type TutorialStep = {
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
};

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to KODΞX",
    description: "Your journey into mindful technology begins here. Let's explore what the platform has to offer.",
    position: 'bottom',
  },
  {
    title: "Your Dashboard",
    description: "This is your personal hub where you can track your progress, achievements, and learning journey.",
    target: '.dashboard-content',
    position: 'top',
  },
  {
    title: "XP & Level System",
    description: "Complete labs and projects to earn experience points and level up. Watch your XP ring fill as you progress.",
    target: '.xp-ring',
    position: 'right',
  },
  {
    title: "Badges & Achievements",
    description: "Unlock badges by completing specific challenges and achievements. Each represents a milestone in your journey.",
    target: '.badges-showcase',
    position: 'left',
  },
  {
    title: "Labs & Learning",
    description: "Dive into interactive labs designed to build your skills. Each lab provides focused knowledge and experience.",
    target: '.labs-section',
    position: 'bottom',
  },
  {
    title: "Projects",
    description: "Apply your knowledge in practical projects that challenge you to create solutions for real-world problems.",
    target: '.projects-section',
    position: 'bottom',
  },
  {
    title: "Community Forum",
    description: "Connect with fellow learners, share your journey, and learn from others in our community forum.",
    target: '.forum-link',
    position: 'bottom',
  },
  {
    title: "Your Profile",
    description: "Personalize your experience and showcase your achievements through your profile settings.",
    target: '.user-menu-button',
    position: 'bottom',
  },
  {
    title: "Ready to Begin?",
    description: "Your journey into mindful technology starts now. Remember, the goal isn't just to learn technology—it's to use it with intention and awareness.",
    position: 'bottom',
  },
];

const OnboardingTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate position for tooltip based on target element
  useEffect(() => {
    const step = tutorialSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetElement(element.getBoundingClientRect());
      } else {
        setTargetElement(null);
      }
    } else {
      setTargetElement(null);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    const confirmed = window.confirm("Are you sure you want to skip the tutorial? You can access it again from your profile settings.");
    if (confirmed) {
      completeTutorial();
    }
  };

  const completeTutorial = async () => {
    setVisible(false);
    
    if (user?.id) {
      try {
        await apiRequest('/api/users/onboarding/complete', {
          method: 'POST',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        
        // Award the onboarding badge
        await apiRequest('/api/badges/award', {
          method: 'POST',
          body: JSON.stringify({ badgeId: 'onboarding_complete' }),
        });
        
        toast({
          title: "🎉 Onboarding Complete!",
          description: "You've earned the Onboarding badge and 50 XP!",
        });
      } catch (error) {
        console.error("Error completing onboarding:", error);
      }
    }
  };

  const calculatePosition = () => {
    if (!targetElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const step = tutorialSteps[currentStep];
    const padding = 20; // Padding from target element
    
    switch (step.position) {
      case 'top':
        return {
          top: `${targetElement.top - padding - 150}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetElement.bottom + padding}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${targetElement.top + targetElement.height / 2}px`,
          left: `${targetElement.left - padding - 320}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: `${targetElement.top + targetElement.height / 2}px`,
          left: `${targetElement.right + padding}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  // If not visible, don't render
  if (!visible) return null;

  const position = calculatePosition();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Highlight around target element if it exists */}
      {targetElement && (
        <div 
          className="absolute border-2 border-[#9ecfff] rounded-lg pointer-events-none"
          style={{
            top: targetElement.top - 5,
            left: targetElement.left - 5,
            width: targetElement.width + 10,
            height: targetElement.height + 10,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 15px 5px rgba(158, 207, 255, 0.5)',
          }}
        ></div>
      )}
      
      {/* Tutorial tooltip */}
      <div 
        className="absolute w-full max-w-md pointer-events-auto bg-gray-900/90 backdrop-blur-md border border-[#9ecfff]/30 p-6 rounded-xl shadow-xl"
        style={position}
      >
        {/* Close button */}
        <button 
          onClick={skipTutorial}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Progress indicator */}
        <div className="mb-4 flex items-center gap-1.5">
          {tutorialSteps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full ${
                index === currentStep 
                  ? 'w-6 bg-gradient-to-r from-[#9ecfff] to-[#6d28d9]' 
                  : 'w-1.5 bg-gray-700'
              } transition-all duration-300`}
            ></div>
          ))}
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] bg-clip-text text-transparent mb-2">
          {tutorialSteps[currentStep].title}
        </h3>
        <p className="text-gray-300 mb-6">
          {tutorialSteps[currentStep].description}
        </p>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-400"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 transition-opacity"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
            {currentStep !== tutorialSteps.length - 1 && (
              <ChevronRight className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;