
import { Check, CheckCheck } from 'lucide-react';

interface MessageStatusIndicatorProps {
  status: 'sent' | 'delivered' | 'read';
  isOnline: boolean;
}

const MessageStatusIndicator = ({ status, isOnline }: MessageStatusIndicatorProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-white/70" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-white/70" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-300" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sent':
        return 'Terkirim';
      case 'delivered':
        return 'Tersampaikan';
      case 'read':
        return 'Dibaca';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-1" title={getStatusText()}>
      {getStatusIcon()}
    </div>
  );
};

export default MessageStatusIndicator;
