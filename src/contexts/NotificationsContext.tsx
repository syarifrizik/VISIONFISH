
import React, { createContext, useContext, ReactNode } from 'react';

interface NotificationsContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Simple console log for now - you can implement toast notifications later
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
