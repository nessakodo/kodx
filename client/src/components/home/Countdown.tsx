import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

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

  return (
    <section className="text-center mb-16 px-4">
      <div className="inline-block">
        <GlassmorphicCard className="p-6 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9ecfff]/5 to-[#88c9b7]/5"></div>
          
          <div className="relative z-10">
            <h3 className="font-orbitron text-xl mb-4 uppercase">Next Lab Drop</h3>
            
            <CountdownTimer targetDate={targetDate} />
            
            <Button 
              variant="outline" 
              className="mt-4 text-sm px-4 py-2 h-auto bg-transparent border border-[#9ecfff]/30 hover:bg-[#9ecfff]/10 transition-all flex items-center gap-2 mx-auto"
              onClick={handleAddToCalendar}
            >
              <CalendarIcon size={16} />
              <span>Add to Calendar</span>
            </Button>
          </div>
        </GlassmorphicCard>
      </div>
    </section>
  );
}
