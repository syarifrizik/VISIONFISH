
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WeatherParameterCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: string | number;
  unit?: string;
  label: string;
  explanation: string;
  example: string;
}

export const WeatherParameterCard = ({
  icon: Icon,
  iconColor,
  value,
  unit,
  label,
  explanation,
  example
}: WeatherParameterCardProps) => {
  const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 bg-white dark:bg-gray-800 border shadow-lg">
          <div className="space-y-2">
            <p className="text-sm font-medium">{explanation}</p>
            <p className="text-xs text-muted-foreground">{example}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const InfoHoverCard = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 bg-white dark:bg-gray-800 border shadow-lg">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <h4 className="font-semibold">{label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{explanation}</p>
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Contoh:</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">{example}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="text-center p-4 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 relative group"
    >
      <div className="flex items-center justify-center mb-3 relative">
        <Icon className={`w-10 h-10 ${iconColor}`} />
        
        {/* Desktop: Hover Card */}
        <div className="hidden md:block absolute -top-1 -right-1">
          <InfoHoverCard>
            <button className="w-5 h-5 rounded-full bg-blue-500 dark:bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-600 dark:hover:bg-purple-600">
              <Info className="w-3 h-3" />
            </button>
          </InfoHoverCard>
        </div>

        {/* Mobile: Tooltip */}
        <div className="md:hidden absolute -top-1 -right-1">
          <InfoTooltip>
            <button className="w-5 h-5 rounded-full bg-blue-500 dark:bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-600 dark:hover:bg-purple-600">
              <Info className="w-3 h-3" />
            </button>
          </InfoTooltip>
        </div>
      </div>
      
      <div className="text-3xl font-bold">
        {value}{unit && <span className="text-lg">{unit}</span>}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};
