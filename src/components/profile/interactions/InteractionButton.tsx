
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface InteractionButtonProps {
  icon: React.ComponentType<any>;
  count: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  isActive?: boolean;
  size?: 'sm' | 'default';
}

const InteractionButton = ({ 
  icon: Icon, 
  count, 
  onClick, 
  disabled, 
  className = '', 
  title,
  isActive = false,
  size = 'sm'
}: InteractionButtonProps) => {
  return (
    <Button
      size={size}
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 transition-all duration-200 ${className}`}
      title={title}
    >
      <motion.div
        whileTap={{ scale: disabled ? 1 : 1.2 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
      </motion.div>
      <span className="text-xs font-medium">{count}</span>
    </Button>
  );
};

export default InteractionButton;
