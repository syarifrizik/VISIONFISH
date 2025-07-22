
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Only update the actual value if it's a valid number (excluding 4)
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 9 && numValue !== 4) {
      onChange(name, [numValue]);
    }
  };
  
  const handleInputBlur = () => {
    setIsFocused(false);
    
    // If the input is empty or invalid, reset to the previous valid value
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1 || numValue > 9 || numValue === 4) {
      setInputValue(value.toString());
    } else {
      onChange(name, [numValue]);
    }
  };
  
  const incrementValue = () => {
    if (value < 9) {
      const nextValue = value + 1;
      // Skip value 4 as it's not valid in SNI
      onChange(name, [nextValue === 4 ? 5 : nextValue]);
    }
  };
  
  const decrementValue = () => {
    if (value > 1) {
      const nextValue = value - 1;
      // Skip value 4 as it's not valid in SNI
      onChange(name, [nextValue === 4 ? 3 : nextValue]);
    }
  };
  
  const renderInvalidScoreWarning = (value: number) => {
    return value === 4 ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nilai 4 tidak valid dalam standar SNI. Gunakan nilai 1-3 atau 5-9</p>
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
          <span className={`mr-2 ${value === 4 ? 'text-amber-500' : 'text-visionfish-neon-blue'}`}>
            {value} {value === 4 && '(tidak valid)'}
          </span>
          
          <div className="flex flex-col">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={incrementValue}
              disabled={value >= 9}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={decrementValue}
              disabled={value <= 1}
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
                value === 4 ? 'text-amber-500 border-amber-500' : 'text-visionfish-neon-blue'
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
          // Skip value 4 as it's not valid in SNI
          if (val[0] !== 4) {
            onChange(name, val);
          }
        }}
        className={`cursor-pointer ${value === 4 ? 'slider-warning' : ''}`}
      />
    </div>
  );
};

export default ParameterInput;
