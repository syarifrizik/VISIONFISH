
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MapPin, 
  Clock,
  Fish,
  BookOpen,
  Users,
  MoreHorizontal
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'catch' | 'note' | 'activity' | 'community';
  title: string;
  description?: string;
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
}

interface MobileContentCardsProps {
  items: ContentItem[];
}

const MobileContentCards = ({ items }: MobileContentCardsProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'catch': return Fish;
      case 'note': return BookOpen;
      case 'activity': return Users;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'catch': return 'from-cyan-400 to-blue-500';
      case 'note': return 'from-green-400 to-emerald-500';
      case 'activity': return 'from-purple-400 to-pink-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-4 p-6">
      {items.map((item, index) => {
        const TypeIcon = getTypeIcon(item.type);
        const typeColor = getTypeColor(item.type);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative group"
          >
            {/* Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl" />
              <div className="absolute inset-0 border border-white/20 rounded-3xl" />
              
              {/* Content */}
              <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${typeColor} flex items-center justify-center shadow-lg`}>
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                        {item.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"
                  >
                    <MoreHorizontal className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}

                {/* Image */}
                {item.image && (
                  <div className="relative mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={item.image}
                      alt="Content image"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <Heart className="w-4 h-4 text-white/60 group-hover:text-red-400" />
                      </div>
                      <span className="text-sm text-white/60">{item.likes}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <MessageCircle className="w-4 h-4 text-white/60 group-hover:text-blue-400" />
                      </div>
                      <span className="text-sm text-white/60">{item.comments}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <Share className="w-4 h-4 text-white/60 group-hover:text-green-400" />
                      </div>
                    </motion.button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-yellow-500/20 transition-colors group"
                  >
                    <Bookmark className="w-4 h-4 text-white/60 group-hover:text-yellow-400" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MobileContentCards;
