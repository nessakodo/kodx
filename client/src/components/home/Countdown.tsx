import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export function Countdown() {
  // Set a date 7 days from now for the next lab drop
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const handleAddToCalendar = () => {
    // Create iCalendar file content
    const title = "KODΞX Next Lab Drop";
    const description = "New labs and projects launching on KODΞX WORLD.";
    const location = "https://kodex.world";
    
    const startTime = targetDate.toISOString().replace(/-|:|\.\d+/g, "");
    const endTime = new Date(targetDate.getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    
    // Create file and trigger download
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kodex-next-lab-drop.ics";
    link.click();
  };
  
  // Calculate remaining time
  const calculateTimeRemaining = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    // Convert to days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };
  
  const { days, hours, minutes, seconds } = calculateTimeRemaining();

  return (
    <GlassmorphicCard className="h-full p-6 flex flex-col">
      <h3 className="font-orbitron text-xl text-white mb-4">Next Content Drop</h3>
      
      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="text-3xl font-mono text-[#9ecfff] font-bold my-2">
          {days.toString().padStart(2, '0')}:{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        
        <div className="grid grid-cols-4 w-full gap-1 text-center text-xs text-gray-400 mb-4">
          <div>DAYS</div>
          <div>HRS</div>
          <div>MIN</div>
          <div>SEC</div>
        </div>
        
        <p className="text-center text-sm text-gray-400 mb-6">
          New labs, projects and community challenges dropping soon!
        </p>
        
        <Button 
          variant="outline" 
          className="text-sm px-4 py-2 h-auto bg-transparent border border-[#9ecfff]/30 hover:bg-[#9ecfff]/10 transition-all flex items-center gap-2 w-full justify-center"
          onClick={handleAddToCalendar}
        >
          <CalendarIcon size={16} />
          <span>Add to Calendar</span>
        </Button>
      </div>
    </GlassmorphicCard>
  );
}
