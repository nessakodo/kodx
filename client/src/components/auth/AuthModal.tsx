import { useState } from "react";
import { KodexModal } from "@/components/ui/kodex-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type AuthMode = "login" | "register" | "test-accounts";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "test-accounts" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      // For the demo, we'll just redirect to the test login
      toast({
        title: "Login Successful",
        description: "Welcome back to KOD•X",
      });
      
      // Simulate login and redirect
      setTimeout(() => {
        window.location.href = `/api/login?type=regular`;
      }, 1500);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onRegisterSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      // For the demo, we'll just redirect to the test login
      toast({
        title: "Registration Successful",
        description: "Welcome to KOD•X",
      });
      
      // Simulate registration and redirect
      setTimeout(() => {
        window.location.href = `/api/login?type=regular&username=${values.username}`;
      }, 1500);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTestAccountLogin = (accountType: string) => {
    window.location.href = `/api/login?type=${accountType}`;
  };

  return (
    <KodexModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "test-accounts" ? "Access Options" : (mode === "login" ? "Sign In" : "Create Account")}
      width="md"
    >
      <div className="p-5">
        {mode === "test-accounts" && (
          <>
            <div className="mb-6">
              <Tabs defaultValue="test-accounts" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="test-accounts" onClick={() => setMode("test-accounts")}>Test Accounts</TabsTrigger>
                  <TabsTrigger value="login" onClick={() => setMode("login")}>Sign In</TabsTrigger>
                  <TabsTrigger value="register" onClick={() => setMode("register")}>Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <p className="text-sm text-gray-400 mb-4">
                Choose a test account to explore different user experiences:
              </p>
              
              <div className="space-y-4">
                {/* Regular User */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#0d2e4d]/30 to-[#1e2535]/30 hover:from-[#0d2e4d]/50 hover:to-[#1e2535]/50 border border-[#9ecfff]/20 cursor-pointer transition-all duration-300"
                  onClick={() => handleTestAccountLogin("regular")}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#0D8ABC] flex items-center justify-center text-white">
                    TU
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Test User</div>
                    <div className="text-sm text-gray-400">Level 3 • Regular User</div>
                    <div className="text-xs text-[#9ecfff]/80 mt-1">1,250 XP • Beginner features</div>
                  </div>
                </div>
                
                {/* Experienced User */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#2a0d4d]/30 to-[#1e2535]/30 hover:from-[#2a0d4d]/50 hover:to-[#1e2535]/50 border border-[#bb86fc]/20 cursor-pointer transition-all duration-300"
                  onClick={() => handleTestAccountLogin("experienced")}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#9C27B0] flex items-center justify-center text-white">
                    AU
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Advanced User</div>
                    <div className="text-sm text-gray-400">Level 7 • Experienced</div>
                    <div className="text-xs text-[#bb86fc]/80 mt-1">5,750 XP • Completed projects</div>
                  </div>
                </div>
                
                {/* Admin User */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#4d0d0d]/30 to-[#1e2535]/30 hover:from-[#4d0d0d]/50 hover:to-[#1e2535]/50 border border-[#ff9e9e]/20 cursor-pointer transition-all duration-300"
                  onClick={() => window.location.href = "/api/auth/admin"}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#F44336] flex items-center justify-center text-white">
                    AD
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Admin User</div>
                    <div className="text-sm text-gray-400">Level 9 • Administrator</div>
                    <div className="text-xs text-[#ff9e9e]/80 mt-1">9,950 XP • Full admin access</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 italic">
                Note: These are test accounts for demonstration purposes only.
              </div>
            </div>
          </>
        )}

        {mode === "login" && (
          <>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="test-accounts" onClick={() => setMode("test-accounts")}>Test Accounts</TabsTrigger>
                <TabsTrigger value="login" onClick={() => setMode("login")}>Sign In</TabsTrigger>
                <TabsTrigger value="register" onClick={() => setMode("register")}>Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="******" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between items-center pt-2">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-[#9ecfff] hover:text-[#bb86fc] px-0"
                    onClick={() => setMode("register")}
                  >
                    Create an account
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 text-[#9ecfff]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {mode === "register" && (
          <>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="test-accounts" onClick={() => setMode("test-accounts")}>Test Accounts</TabsTrigger>
                <TabsTrigger value="login" onClick={() => setMode("login")}>Sign In</TabsTrigger>
                <TabsTrigger value="register" onClick={() => setMode("register")}>Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="coolhacker42" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="******" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="******" 
                          className="bg-[#1e2535] border-[#9ecfff]/30 focus:border-[#9ecfff]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between items-center pt-2">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-[#9ecfff] hover:text-[#bb86fc] px-0"
                    onClick={() => setMode("login")}
                  >
                    Already have an account?
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#9ecfff]/40 to-[#bb86fc]/40 hover:from-[#9ecfff]/60 hover:to-[#bb86fc]/60 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </KodexModal>
  );
}