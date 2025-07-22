
import { X } from "lucide-react";
import { motion } from "framer-motion";

export interface ToastNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface ToastNotificationProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}

export const ToastNotification = ({ notification, onDismiss }: ToastNotificationProps) => {
  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="notification-toast"
      role="alert"
    >
      <div className="notification-toast-icon">
        {notification.type === 'success' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {notification.type === 'info' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        {notification.type === 'error' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        {notification.type === 'warning' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.2998 3.86001L2.59982 17.14C1.89982 18.27 2.71982 19.75 4.03982 19.75H19.9598C21.2798 19.75 22.0998 18.27 21.3998 17.14L13.6998 3.86001C12.9998 2.73001 10.9998 2.73001 10.2998 3.86001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div className="notification-toast-content">
        <p className="text-white">{notification.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(notification.id)} 
        className="notification-toast-close"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

