
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FishParameter } from "@/utils/fish-analysis";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ParameterInputProps {
  name: keyof FishParameter;
  value: number;
  onChange: (name: keyof FishParameter, value: number[]) => void;
}

const ParameterInput = ({ name, value, onChange }: ParameterInputProps) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  
  // Update input value when prop value changes (e.g., from slider)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  
  // Valid scores for each parameter according to SNI standards
  const validScores: Record<string, number[]> = {
    Mata: [1, 3, 5, 6, 7, 8, 9],
    Insang: [1, 3, 6, 7, 8, 9],
    Lendir: [1, 3, 5, 6, 7, 8, 9],
    Daging: [1, 5, 6, 7, 8, 9],
    Bau: [1, 3, 5, 6, 7, 8, 9],
    Tekstur: [1, 3, 6, 7, 8, 9],
  };
  
  const currentValidScores = validScores[name as string] || [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Only update the actual value if it's a valid number for this parameter
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 9 && currentValidScores.includes(numValue)) {
      onChange(name, [numValue]);
    }
  };
  
  const handleInputBlur = () => {
    setIsFocused(false);
    
    // If the input is empty or invalid, reset to the previous valid value
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1 || numValue > 9 || !currentValidScores.includes(numValue)) {
      setInputValue(value.toString());
    } else {
      onChange(name, [numValue]);
    }
  };
  
  const incrementValue = () => {
    const currentIndex = currentValidScores.indexOf(value);
    if (currentIndex < currentValidScores.length - 1) {
      const nextValue = currentValidScores[currentIndex + 1];
      onChange(name, [nextValue]);
    }
  };
  
  const decrementValue = () => {
    const currentIndex = currentValidScores.indexOf(value);
    if (currentIndex > 0) {
      const nextValue = currentValidScores[currentIndex - 1];
      onChange(name, [nextValue]);
    }
  };
  
  const renderInvalidScoreWarning = (value: number) => {
    return !currentValidScores.includes(value) ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nilai {value} tidak valid untuk parameter {name} dalam standar SNI. Nilai valid: {currentValidScores.join(', ')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : null;
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor={name} className="flex items-center">
          {name}
          {renderInvalidScoreWarning(value)}
        </Label>
        <div className="flex items-center">
          <span className={`mr-2 ${!currentValidScores.includes(value) ? 'text-amber-500' : 'text-visionfish-neon-blue'}`}>
            {value} {!currentValidScores.includes(value) && '(tidak valid)'}
          </span>
          
          <div className="flex flex-col">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={incrementValue}
              disabled={currentValidScores.indexOf(value) >= currentValidScores.length - 1}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={decrementValue}
              disabled={currentValidScores.indexOf(value) <= 0}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="w-16 ml-2">
            <Input
              type="number"
              min={1}
              max={9}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleInputBlur}
              className={`text-center h-8 ${
                !currentValidScores.includes(value) ? 'text-amber-500 border-amber-500' : 'text-visionfish-neon-blue'
              } ${isFocused ? 'border-visionfish-neon-blue ring-1 ring-visionfish-neon-blue' : ''}`}
            />
          </div>
        </div>
      </div>
      
      <Slider
        id={name}
        min={1}
        max={9}
        step={1}
        value={[value]}
        onValueChange={(val) => {
          // Only allow valid values for this parameter
          if (currentValidScores.includes(val[0])) {
            onChange(name, val);
          } else {
            // Find closest valid score
            const closestScore = currentValidScores.reduce((closest, current) => 
              Math.abs(current - val[0]) < Math.abs(closest - val[0]) ? current : closest
            );
            onChange(name, [closestScore]);
          }
        }}
        className={`cursor-pointer ${!currentValidScores.includes(value) ? 'slider-warning' : ''}`}
      />
    </div>
  );
};

export default ParameterInput;
