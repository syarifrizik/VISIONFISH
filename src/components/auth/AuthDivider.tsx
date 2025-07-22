
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

interface AuthDividerProps {
  text?: string;
  className?: string;
}

const AuthDivider = ({ text = 'OR', className }: AuthDividerProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn('relative flex items-center justify-center my-6', className)}
    >
      <div className={cn(
        'absolute inset-0 flex items-center',
        'before:content-[\'\'] before:flex-1 before:border-t before:border-gray-300 dark:before:border-gray-600',
        'after:content-[\'\'] after:flex-1 after:border-t after:border-gray-300 dark:after:border-gray-600'
      )} />
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          'relative px-4 py-2 rounded-full backdrop-blur-xl border shadow-lg',
          isDark 
            ? 'bg-white/10 border-white/20 text-white/80' 
            : 'bg-white/90 border-gray-200/60 text-gray-600'
        )}
      >
        <span className="text-sm font-medium tracking-wide">{text}</span>
      </motion.div>
    </motion.div>
  );
};

export default AuthDivider;
