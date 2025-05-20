import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
}

export function CountdownTimer({ 
  targetDate, 
  className,
  onComplete 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        
        if (onComplete) {
          onComplete();
        }
        
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-orbitron font-bold mb-1 bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-xs uppercase text-gray-500">Days</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-3xl font-orbitron font-bold mb-1 bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xs uppercase text-gray-500">Hours</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-3xl font-orbitron font-bold mb-1 bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs uppercase text-gray-500">Minutes</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-3xl font-orbitron font-bold mb-1 bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs uppercase text-gray-500">Seconds</div>
      </div>
    </div>
  );
}
