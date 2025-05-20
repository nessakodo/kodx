import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "wouter";
import { apiRequest } from "@lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type LoginFormData = {
  username: string;
  password: string;
};

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
      const response = await apiRequest("/api/login", {
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
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Navigate to dashboard after successful login
        navigate("/dashboard");
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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-black/10 backdrop-blur-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="bg-black/20 border-gray-700"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a 
                href="#" 
                className="text-xs text-blue-500 hover:text-blue-400"
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
              className="bg-black/20 border-gray-700"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="rounded text-primary-500 focus:ring-primary-500" 
            />
            <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
      
      <div className="p-4 text-center text-sm">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <a 
            href="#" 
            className="text-blue-500 hover:text-blue-400"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
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
  );
}