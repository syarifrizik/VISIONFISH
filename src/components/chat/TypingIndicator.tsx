
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  const [dotAnimation, setDotAnimation] = useState(0);

  useEffect(() => {
    if (typingUsers.length > 0) {
      const interval = setInterval(() => {
        setDotAnimation((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [typingUsers.length]);

  if (typingUsers.length === 0) return null;

  const displayText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].display_name} sedang mengetik`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].display_name} dan ${typingUsers[1].display_name} sedang mengetik`;
    } else {
      return `${typingUsers[0].display_name} dan ${typingUsers.length - 1} lainnya sedang mengetik`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-3 px-4 py-2 mb-2"
      >
        {/* Avatar Stack */}
        <div className="flex -space-x-2">
          {typingUsers.slice(0, 3).map((user, index) => (
            <Avatar key={user.user_id} className="w-6 h-6 border-2 border-white">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="bg-[#6E3482] text-white text-xs">
                {user.display_name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* Typing Text */}
        <div className="flex items-center gap-1 text-sm text-[#6E3482]">
          <span>{displayText()}</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-[#6E3482] rounded-full"
                animate={{
                  opacity: dotAnimation === i ? 1 : 0.3,
                  scale: dotAnimation === i ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingIndicator;
