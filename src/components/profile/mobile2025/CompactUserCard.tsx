
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  MessageCircle, 
  UserPlus, 
  UserCheck,
  MapPin,
  Fish,
  Lock
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  location?: string;
  fish_caught?: number;
  is_following?: boolean;
  is_private?: boolean;
}

interface CompactUserCardProps {
  user: User;
  onViewProfile: (userId: string) => void;
  onMessage: (userId: string) => void;
  onFollow: (userId: string) => void;
}

const CompactUserCard = ({ 
  user, 
  onViewProfile, 
  onMessage, 
  onFollow 
}: CompactUserCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-lg"
    >
      <div className="flex items-center gap-4">
        {/* Avatar - Clickable */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer relative"
          onClick={() => onViewProfile(user.id)}
        >
          <Avatar className="w-14 h-14 ring-2 ring-white/20 shadow-lg">
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
              {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {user.is_private && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
          )}
        </motion.div>

        {/* User Info - Clickable */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewProfile(user.id)}
        >
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white truncate hover:text-blue-300 transition-colors">
              {user.display_name || user.username}
            </h3>
            {user.is_private && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Privat
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-white/60 truncate hover:text-white/80 transition-colors mb-2">
            @{user.username}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center gap-3">
            {user.location && (
              <div className="flex items-center gap-1 text-xs text-white/50">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-20">{user.location}</span>
              </div>
            )}
            {user.fish_caught !== undefined && (
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Fish className="w-3 h-3" />
                <span>{user.fish_caught}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* View Profile */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onViewProfile(user.id)}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Message */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onMessage(user.id)}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Follow/Unfollow */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onFollow(user.id)}
              variant="ghost"
              size="sm"
              className={`h-9 w-9 p-0 rounded-xl transition-all ${
                user.is_following
                  ? 'text-green-400 bg-green-500/20 hover:bg-green-500/30'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {user.is_following ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactUserCard;
