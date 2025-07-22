
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Mail, RefreshCw, ArrowRight } from 'lucide-react';

interface AuthNotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  action?: 'login' | 'resend_confirmation' | 'check_email';
  userEmail?: string;
  onActionClick?: (action: string) => void;
  onResendConfirmation?: () => void;
  isResending?: boolean;
  isDark?: boolean;
}

export const AuthNotification = ({ 
  type, 
  message, 
  action, 
  userEmail,
  onActionClick, 
  onResendConfirmation,
  isResending = false,
  isDark = false 
}: AuthNotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Mail className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getActionButton = () => {
    switch (action) {
      case 'login':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onActionClick?.('login')}
            className={cn(
              "mt-3",
              isDark 
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Beralih ke Login
          </Button>
        );
      
      case 'resend_confirmation':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={onResendConfirmation}
            disabled={isResending}
            className={cn(
              "mt-3",
              isDark 
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50" 
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
            )}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Kirim Ulang Konfirmasi
              </>
            )}
          </Button>
        );
      
      case 'check_email':
        return (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Mail className="w-4 h-4" />
              <span>Periksa kotak masuk email {userEmail ? `(${userEmail})` : 'Anda'}</span>
            </div>
            {onResendConfirmation && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onResendConfirmation}
                disabled={isResending}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Mengirim ulang...
                  </>
                ) : (
                  'Tidak menerima email? Kirim ulang'
                )}
              </Button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Alert className={cn(
          "backdrop-blur-sm shadow-lg",
          type === 'success' && "border-emerald-400/30 bg-emerald-500/10",
          type === 'error' && "border-red-400/30 bg-red-500/10",
          type === 'info' && "border-blue-400/30 bg-blue-500/10",
          isDark ? "text-white" : "text-slate-800"
        )}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1">
              <AlertDescription className="font-medium leading-relaxed">
                {message}
              </AlertDescription>
              {getActionButton()}
            </div>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};
