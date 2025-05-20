import { useState } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email
      const validatedData = emailSchema.parse({ email });
      
      // Submit to API
      await apiRequest("POST", "/api/newsletter/signup", validatedData);
      
      // Success
      toast({
        title: "Subscription successful!",
        description: "Thanks for subscribing to KODΞX SIGNAL.",
        variant: "default",
      });
      
      // Reset form
      setEmail("");
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
      } else {
        // Handle API errors
        toast({
          title: "Subscription failed",
          description: "There was an error subscribing to the newsletter. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 mb-16">
      <GlassmorphicCard className="p-8 rounded-2xl overflow-hidden relative">
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#b166ff]/5 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="font-orbitron text-2xl tracking-wider mb-4 uppercase">
              Join <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">KODΞX SIGNAL</span>
            </h2>
            <p className="text-gray-500">
              Get weekly updates on new Labs, Projects, and security insights. Our newsletter focuses on practical techniques and mindful technology practices.
            </p>
          </div>
          
          <div className="md:w-1/2 w-full">
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-[#1e2535]/50 border border-[#9ecfff]/20 rounded-lg px-4 py-3 h-auto flex-1 focus-visible:ring-[#9ecfff]/50 placeholder:text-gray-500/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="bg-[#1e2535]/60 hover:bg-[#1e2535]/90 backdrop-blur-md rounded-lg border border-[#9ecfff]/30 hover:border-[#9ecfff]/50 text-gray-200 transition-all font-medium px-6 py-3 h-auto hover-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </GlassmorphicCard>
    </section>
  );
}
