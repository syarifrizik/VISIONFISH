
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CardHeader from './card/CardHeader';

interface ProfileItemCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  date: string;
  location?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  isOwner: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  ownerInfo?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  showOwnerInfo?: boolean;
}

const ProfileItemCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  date,
  location,
  stats,
  isOwner,
  onEdit,
  onDelete,
  onView,
  ownerInfo,
  showOwnerInfo = false
}: ProfileItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
      onClick={() => onView(id)}
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#49225B]/20 relative">
        <CardContent className="p-0 h-full flex flex-col">
          <CardHeader
            imageUrl={imageUrl}
            category={category}
            isOwner={isOwner}
            isHovered={isHovered}
            onEdit={() => onEdit(id)}
            onDelete={() => onDelete(id)}
            ownerInfo={ownerInfo}
            showOwnerInfo={showOwnerInfo}
          />

          {/* Content Area */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm line-clamp-2 leading-tight">
                {title}
              </h4>
              {description && (
                <p className="text-[#E7D7EF] text-xs leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Footer Info */}
            <div className="space-y-2 mt-3">
              {/* Location & Date */}
              <div className="flex items-center justify-between text-xs text-[#E7D7EF]">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-20">{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#E7D7EF]">
                    <span>{stats.views} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-pink-300">
                    <span>{stats.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-300">
                    <span>{stats.comments} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileItemCard;
