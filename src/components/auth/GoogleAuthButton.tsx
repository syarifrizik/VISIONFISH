
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  onGoogleLogin: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const GoogleAuthButton = ({ onGoogleLogin, isLoading, className }: GoogleAuthButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        type="button"
        onClick={onGoogleLogin}
        disabled={isLoading}
        className={cn(
          'w-full h-14 transition-all duration-300 relative overflow-hidden group',
          'border-2 font-semibold text-base shadow-lg hover:shadow-xl',
          'focus:ring-4 focus:ring-blue-500/20',
          isDark 
            ? 'bg-white/5 dark:bg-gray-900/50 hover:bg-white/10 dark:hover:bg-gray-800/70 border-white/20 dark:border-gray-700 hover:border-blue-300/50 dark:hover:border-blue-600/50 text-white/90 dark:text-gray-200'
            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700 shadow-md hover:shadow-lg',
          className
        )}
      >
        {/* Enhanced animated background gradient for both themes */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          isDark 
            ? "bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/15 group-hover:to-blue-500/10"
            : "bg-gradient-to-r from-blue-500/0 via-blue-500/3 to-blue-500/0 group-hover:from-blue-500/8 group-hover:via-blue-500/12 group-hover:to-blue-500/8"
        )} />
        
        <div className="relative z-10 flex items-center justify-center gap-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </motion.div>
          )}
          <span className="font-semibold">
            {isLoading ? 'Mengarahkan...' : 'Lanjutkan dengan Google'}
          </span>
        </div>
        
        {/* Enhanced shine effect for both themes */}
        <motion.div
          className={cn(
            "absolute inset-0 -skew-x-12",
            isDark 
              ? "bg-gradient-to-r from-transparent via-white/15 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/40 to-transparent"
          )}
          animate={{ x: [-100, 300] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </Button>
    </motion.div>
  );
};

export default GoogleAuthButton;
