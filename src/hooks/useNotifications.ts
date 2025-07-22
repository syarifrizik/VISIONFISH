
import { useState } from 'react';
import { ToastNotification } from '@/components/notifications/ToastNotification';

export const useNotifications = () => {
  const [activeNotifications, setActiveNotifications] = useState<ToastNotification[]>([]);
  
  const showNotification = (
    message: string, 
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    duration: number = 5000
  ) => {
    const toastId = Date.now().toString();
    const newNotification = {
      id: toastId,
      message,
      type
    };
    
    setActiveNotifications(prev => [...prev, newNotification]);
    
    // Auto dismiss after specified duration
    setTimeout(() => {
      dismissNotification(toastId);
    }, duration);
    
    return toastId;
  };
  
  const dismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return {
    activeNotifications,
    showNotification,
    dismissNotification
  };
};
