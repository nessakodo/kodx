import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X as CloseIcon } from "lucide-react";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to KOD-X WORLD!",
        });
        
        // Navigate to dashboard after successful login
        setLocation("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold text-center text-blue-400">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.username && (
                <p className="text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <a 
                  href="#" 
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Password Reset",
                      description: "This feature is coming soon!",
                    });
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="bg-black/40 border-gray-700 text-white"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded text-blue-500 focus:ring-blue-500 bg-black/40 border-gray-700" 
              />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-300">Remember me</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setLocation("/")}
              >
                Browse without logging in
              </Button>
            </div>
          </CardFooter>
        </form>
        
        <div className="p-4 text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a 
              href="#" 
              className="text-blue-400 hover:text-blue-300"
              onClick={(e) => {
                e.preventDefault();
                setLocation("/register");
              }}
            >
              Create an account
            </a>
          </p>
          
          <div className="mt-4">
            <p className="text-gray-500 text-xs">Test credentials:</p>
            <p className="text-gray-400 text-xs">Admin: admin / admin1234!</p>
            <p className="text-gray-400 text-xs">User: testuser / testuser1234!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}