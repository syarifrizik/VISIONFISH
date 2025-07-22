
import { AnimatePresence } from "framer-motion";
import { ToastNotification as ToastNotificationType, ToastNotification } from "./ToastNotification";

interface NotificationCenterProps {
  notifications: ToastNotificationType[];
  dismissNotification: (id: string) => void;
}

export const NotificationCenter = ({ notifications, dismissNotification }: NotificationCenterProps) => {
  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </AnimatePresence>
  );
};

