import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Code, 
  Award, 
  Lightbulb, 
  Shield, 
  Brain, 
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Settings
} from 'lucide-react';

const avatarOptions = [
  { id: 'default', image: '/avatars/default.png', name: 'Default' },
  { id: 'cyber1', image: '/avatars/cyber1.png', name: 'Cyber 1' },
  { id: 'cyber2', image: '/avatars/cyber2.png', name: 'Cyber 2' },
  { id: 'zen1', image: '/avatars/zen1.png', name: 'Zen 1' },
  { id: 'zen2', image: '/avatars/zen2.png', name: 'Zen 2' },
  { id: 'tech1', image: '/avatars/tech1.png', name: 'Tech 1' },
  { id: 'tech2', image: '/avatars/tech2.png', name: 'Tech 2' },
  { id: 'balance1', image: '/avatars/balance1.png', name: 'Balance 1' },
];

const OnboardingTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [customUsername, setCustomUsername] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Complete onboarding mutation
  const { mutate: completeOnboarding, isPending } = useMutation({
    mutationFn: (data: any) => apiRequest('/api/user/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setOpen(false);
    }
  });

  const steps = [
    {
      title: "Welcome to KODΞX",
      description: "Your journey into mindful technology begins here. Let's get you set up with a few quick steps.",
      content: (
        <div className="text-center space-y-6 py-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Digital Security & Mindful Tech</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              KODΞX is your guide to mastering digital security while maintaining a balanced relationship with technology.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Avatar",
      description: "Select an avatar that represents you in the digital realm.",
      content: (
        <div className="py-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {avatarOptions.map((avatar) => (
              <div 
                key={avatar.id}
                className={`relative cursor-pointer transition-all ${
                  selectedAvatar === avatar.id 
                    ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={avatar.image} />
                  <AvatarFallback>{avatar.name[0]}</AvatarFallback>
                </Avatar>
                {selectedAvatar === avatar.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary absolute -top-2 -right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Personalize Your Profile",
      description: "You can customize your username or keep your current one.",
      content: (
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarOptions.find(a => a.id === selectedAvatar)?.image} />
              <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder={user?.username || "Your username"} 
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Interests",
      description: "Select topics you're interested in exploring on KODΞX.",
      content: (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'security', label: 'Digital Security', icon: <Shield className="w-4 h-4 mr-2" /> },
              { id: 'mindfulness', label: 'Tech Mindfulness', icon: <Brain className="w-4 h-4 mr-2" /> },
              { id: 'coding', label: 'Coding & Projects', icon: <Code className="w-4 h-4 mr-2" /> },
              { id: 'privacy', label: 'Privacy Protection', icon: <Lightbulb className="w-4 h-4 mr-2" /> },
              { id: 'community', label: 'Community Learning', icon: <Users className="w-4 h-4 mr-2" /> },
              { id: 'achievements', label: 'Achievements & Growth', icon: <Award className="w-4 h-4 mr-2" /> },
            ].map((interest) => (
              <div key={interest.id} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id={interest.id}
                  checked={selectedInterests.includes(interest.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedInterests([...selectedInterests, interest.id]);
                    } else {
                      setSelectedInterests(selectedInterests.filter(i => i !== interest.id));
                    }
                  }}
                  className="rounded text-primary border-gray-700 bg-gray-800 focus:ring-primary"
                />
                <Label 
                  htmlFor={interest.id}
                  className="flex items-center cursor-pointer font-normal"
                >
                  {interest.icon}
                  {interest.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Let's Begin",
      description: "You're all set to start your journey with KODΞX.",
      content: (
        <div className="py-4 space-y-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You'll find labs, projects, and a community ready to support your growth. Earn badges and XP as you progress!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm">Interactive Labs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Code className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm">Hands-on Projects</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm">Earn Badges</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit onboarding data
      completeOnboarding({
        avatarId: selectedAvatar,
        username: customUsername || undefined,
        interests: selectedInterests
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding({
      completed: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md sm:max-w-lg border-0 bg-black/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {steps[currentStep].content}

        <DialogFooter className="flex justify-between items-center">
          <div>
            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isPending}
              >
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isPending}
              className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90"
            >
              {currentStep === steps.length - 1 ? (
                isPending ? "Saving..." : "Start Exploring"
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;