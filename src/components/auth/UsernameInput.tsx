
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { checkUsernameAvailability } from '@/services/usernameService';
import { cn } from '@/lib/utils';

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  isDark?: boolean;
}

export const UsernameInput = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "Username Anda",
  label = "Username",
  required = false,
  className,
  isDark = false
}: UsernameInputProps) => {
  const [checkResult, setCheckResult] = useState<{ available: boolean; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced username validation
  useEffect(() => {
    if (value.length >= 3) {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      
      const timeout = setTimeout(async () => {
        setIsChecking(true);
        const result = await checkUsernameAvailability(value);
        setCheckResult(result);
        setIsChecking(false);
        onValidationChange?.(result.available);
      }, 500);
      
      setCheckTimeout(timeout);
    } else {
      setCheckResult(null);
      onValidationChange?.(false);
    }

    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
    };
  }, [value, onValidationChange]);

  const handleChange = (inputValue: string) => {
    // Clean username: lowercase, only letters, numbers, underscore
    const cleanUsername = inputValue.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    onChange(cleanUsername);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="username" className={cn(
          "text-sm font-medium",
          isDark ? "text-gray-200" : "text-gray-700"
        )}>
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id="username"
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pr-10",
            isDark 
              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          )}
          required={required}
          minLength={3}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : checkResult ? (
            checkResult.available ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )
          ) : null}
        </div>
      </div>
      
      <AnimatePresence>
        {checkResult && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "text-xs font-medium",
              checkResult.available ? "text-green-600" : "text-red-600"
            )}
          >
            {checkResult.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
