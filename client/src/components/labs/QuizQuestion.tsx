import { Radio, RadioGroup } from "@/components/ui/radio";
import { Label } from "@/components/ui/label";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string;
  onSelect: (answer: string) => void;
  number: number;
  disabled?: boolean;
}

export function QuizQuestion({
  question,
  options,
  selectedAnswer,
  onSelect,
  number,
  disabled = false
}: QuizQuestionProps) {
  return (
    <div className="mb-8 p-4 rounded-lg bg-[#1e2535]/25 border border-[#9ecfff]/10">
      <p className="mb-4 font-medium">
        <span className="text-[#9ecfff]">{number}. </span>
        {question}
      </p>
      
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onSelect}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option, index) => (
          <div 
            key={index} 
            className={`flex items-center p-2 rounded-md ${
              selectedAnswer === option 
                ? 'bg-[#9ecfff]/5 border border-[#9ecfff]/20' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio 
              value={option} 
              id={`q${number}-option${index}`} 
              className="border-[#9ecfff]/50 text-[#9ecfff]"
              disabled={disabled}
            />
            <Label 
              htmlFor={`q${number}-option${index}`} 
              className="ml-2 cursor-pointer text-sm flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
