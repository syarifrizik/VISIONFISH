import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Info, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WeatherExplanation } from '@/utils/weather-explanations';
import { WeatherReferencesModal } from './WeatherReferencesModal';

interface ResponsiveWeatherCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: string | number;
  unit?: string;
  label: string;
  className?: string;
  size?: 'compact' | 'default' | 'large';
  weatherExplanation?: WeatherExplanation;
}

export const ResponsiveWeatherCard = ({
  icon: Icon,
  iconColor,
  value,
  unit,
  label,
  className,
  size = 'default',
  weatherExplanation
}: ResponsiveWeatherCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);
  const [isMobileTapped, setIsMobileTapped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    compact: {
      card: 'p-3',
      icon: 'w-6 h-6',
      value: 'text-lg font-bold',
      unit: 'text-xs',
      label: 'text-xs'
    },
    default: {
      card: 'p-4',
      icon: 'w-8 h-8',
      value: 'text-2xl font-bold',
      unit: 'text-sm',
      label: 'text-sm'
    },
    large: {
      card: 'p-6',
      icon: 'w-12 h-12',
      value: 'text-3xl font-bold',
      unit: 'text-base',
      label: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500';
      case 'medium': return 'border-yellow-500 bg-yellow-500'; 
      case 'low': return 'border-green-500 bg-green-500';
      default: return 'border-blue-500 bg-blue-500';
    }
  };

  const handleMobileCardTap = () => {
    setIsMobileTapped(!isMobileTapped);
  };

  // Desktop: Hover Card with positioning below the card
  const InfoHoverCard = ({ children }: { children: React.ReactNode }) => (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side="bottom" 
        sideOffset={8}
        align="center"
        className="w-80 p-4 bg-white/95 dark:bg-gray-800/95 border shadow-2xl backdrop-blur-sm z-[99999] relative"
        style={{ zIndex: 99999 }}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className={cn('w-5 h-5', iconColor)} />
            <h4 className="font-semibold text-gray-900 dark:text-white">{label}</h4>
            {weatherExplanation && (
              <div className={cn(
                'w-2 h-2 rounded-full',
                getSeverityColor(weatherExplanation.severity)
              )} />
            )}
          </div>
          
          {weatherExplanation && (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {weatherExplanation.explanation}
              </p>
              
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-3 border-blue-500">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Insight Perikanan:
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {weatherExplanation.example}
                </p>
              </div>
              
              <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                  Rekomendasi:
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {weatherExplanation.actionable}
                </p>
              </div>

              {weatherExplanation.references && weatherExplanation.references.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReferencesOpen(true)}
                  className="w-full text-xs mt-2"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Lihat Referensi ({weatherExplanation.references.length})
                </Button>
              )}
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  // Mobile: Dialog Modal with better centering
  const InfoDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90vw] max-w-[400px] mx-auto rounded-2xl top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[99999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={cn('w-5 h-5', iconColor)} />
            {label}
            {weatherExplanation && (
              <div className={cn(
                'w-3 h-3 rounded-full',
                getSeverityColor(weatherExplanation.severity)
              )} />
            )}
          </DialogTitle>
        </DialogHeader>
        
        {weatherExplanation && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kondisi Saat Ini</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {weatherExplanation.explanation}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Insight Perikanan
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {weatherExplanation.example}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Rekomendasi Tindakan
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {weatherExplanation.actionable}
              </p>
            </div>

            {weatherExplanation.references && weatherExplanation.references.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsReferencesOpen(true);
                }}
                className="w-full text-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Lihat Referensi Jurnal ({weatherExplanation.references.length})
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative",
          // Higher z-index when hovered or when mobile is tapped or dialog is open
          (isHovered || isMobileTapped || isDialogOpen) && "z-[60]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card 
          className={cn(
            "backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border-white/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group cursor-pointer relative",
            "rounded-2xl md:rounded-lg mx-2 md:mx-0 shadow-lg hover:shadow-xl",
            className
          )}
          onClick={handleMobileCardTap}
        >
          <CardContent className={cn("text-center", classes.card)}>
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <div className="relative">
                <div className="p-2 rounded-full bg-white/20 dark:bg-gray-700/20 group-hover:bg-white/30 dark:group-hover:bg-gray-700/30 transition-colors">
                  <Icon className={cn(classes.icon, iconColor)} />
                </div>
                
                {/* Info Icon - Show only if weatherExplanation exists */}
                {weatherExplanation && (
                  <>
                    {/* Desktop: Hover Card positioned below with highest z-index */}
                    <div className="hidden md:block absolute -top-1 -right-1">
                      <InfoHoverCard>
                        <button className={cn(
                          'w-5 h-5 rounded-full text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 relative',
                          getSeverityColor(weatherExplanation.severity),
                          'opacity-0 group-hover:opacity-100',
                          'z-[70]'
                        )}
                        style={{ zIndex: 70 }}
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </InfoHoverCard>
                    </div>

                    {/* Mobile: Dialog - Show only when card is tapped */}
                    <div className="md:hidden absolute -top-1 -right-1">
                      <InfoDialog>
                        <button className={cn(
                          'w-5 h-5 rounded-full text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95 relative',
                          getSeverityColor(weatherExplanation.severity),
                          'transform transition-all duration-300',
                          isMobileTapped ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                          'z-[70]'
                        )}
                        style={{ zIndex: 70 }}
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </InfoDialog>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className={cn(classes.value, "text-gray-900 dark:text-white")}>
                  {value}
                </span>
                {unit && (
                  <span className={cn(classes.unit, "text-gray-600 dark:text-gray-300 font-medium")}>
                    {unit}
                  </span>
                )}
              </div>
              
              <span className={cn(classes.label, "text-gray-700 dark:text-gray-300 font-medium capitalize")}>
                {label}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* References Modal */}
      {weatherExplanation?.references && (
        <WeatherReferencesModal
          isOpen={isReferencesOpen}
          onClose={() => setIsReferencesOpen(false)}
          referenceIds={weatherExplanation.references}
          parameterName={label}
        />
      )}
    </>
  );
};
