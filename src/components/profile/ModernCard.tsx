
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  className?: string;
}

const ModernCard = ({ 
  children, 
  variant = 'default', 
  className 
}: ModernCardProps) => {
  const baseStyles = "rounded-xl border transition-all duration-200";
  
  const variants = {
    default: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm",
    glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-lg",
    elevated: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  );
};

export default ModernCard;
