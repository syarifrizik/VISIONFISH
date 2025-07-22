
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useCustomToast must be used within ToastProvider');
  }
  return context;
};

interface MobileToastProviderProps {
  children: ReactNode;
}

const MobileToastProvider = ({ children }: MobileToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastColors = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'from-green-500/10 to-emerald-500/5 border-green-500/20';
      case 'error':
        return 'from-red-500/10 to-rose-500/5 border-red-500/20';
      case 'warning':
        return 'from-yellow-500/10 to-orange-500/5 border-yellow-500/20';
      default:
        return 'from-blue-500/10 to-cyan-500/5 border-blue-500/20';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`bg-gradient-to-r ${getToastColors(toast.type)} backdrop-blur-lg rounded-2xl border p-4 shadow-xl pointer-events-auto`}
              onClick={() => removeToast(toast.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getToastIcon(toast.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {toast.title}
                  </h4>
                  {toast.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                  }}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default MobileToastProvider;
