import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  validValues?: number[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, validValues, ...props }, ref) => {
  // Generate tick marks for invalid values
  const renderTicks = () => {
    if (!validValues || !props.min || !props.max) return null;
    
    const ticks = [];
    for (let i = props.min; i <= props.max; i++) {
      const isValid = validValues.includes(i);
      const position = ((i - props.min) / (props.max - props.min)) * 100;
      
      ticks.push(
        <div
          key={i}
          className={cn(
            "absolute w-1 h-1 rounded-full transform -translate-x-1/2",
            isValid ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
          )}
          style={{ left: `${position}%`, top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}
        />
      );
    }
    return ticks;
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
        {renderTicks()}
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
