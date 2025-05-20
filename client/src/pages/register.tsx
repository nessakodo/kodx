import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X as CloseIcon } from "lucide-react";
import { OnboardingTutorial } from "@/components/onboarding/OnboardingTutorial";

// Registration form validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to KOD-X WORLD! Your journey begins now.",
        });
        
        // Show onboarding tutorial for new users
        setShowOnboarding(true);
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Navigate to dashboard after onboarding
    setLocation("/dashboard");
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    // Navigate to dashboard even if user skips
    setLocation("/dashboard");
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="relative w-full max-w-md shadow-lg border border-gray-800 bg-black/70 backdrop-blur-xl">
        {/* Close button to allow browsing without authentication */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50 transition-colors"
          onClick={() => setLocation("/")}
          aria-label="Close"
        >
          <CloseIcon size={18} />
        </button>
        
        <CardHeader className="space-y-1 pb-3">
          <CardTitle className="text-2xl font-bold text-center text-blue-400">Create an Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Join the KOD-X WORLD community
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                {...register("username")}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.username && (
                <p className="text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a strong password"
                {...register("password")}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="rounded text-blue-500 focus:ring-blue-500 bg-black/40 border-gray-700" 
              />
              <Label htmlFor="terms" className="text-sm font-normal text-gray-300">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setLocation("/")}
              >
                Browse without registering
              </Button>
            </div>
          </CardFooter>
        </form>
        
        <div className="p-4 text-center text-sm">
          <p className="text-gray-400">
            Already have an account?{" "}
            <a 
              href="#" 
              className="text-blue-400 hover:text-blue-300"
              onClick={(e) => {
                e.preventDefault();
                setLocation("/login");
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </Card>
      
      {/* Onboarding Tutorial Modal */}
      <OnboardingTutorial 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}