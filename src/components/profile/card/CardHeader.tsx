
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardHeaderProps {
  imageUrl?: string;
  category: string;
  isOwner: boolean;
  isHovered: boolean;
  onEdit: () => void;
  onDelete: () => void;
  ownerInfo?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  showOwnerInfo?: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'achievement': return '🏆';
    case 'activity': return '🎣';
    case 'statistic': return '📊';
    default: return '📝';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'achievement': return 'from-yellow-500 to-orange-500';
    case 'activity': return 'from-blue-500 to-purple-500';
    case 'statistic': return 'from-green-500 to-teal-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'achievement': return 'Pencapaian';
    case 'activity': return 'Aktivitas';
    case 'statistic': return 'Statistik';
    default: return 'Lainnya';
  }
};

const CardHeader = ({ 
  imageUrl, 
  category, 
  isOwner, 
  isHovered, 
  onEdit, 
  onDelete,
  ownerInfo,
  showOwnerInfo 
}: CardHeaderProps) => {
  return (
    <>
      {/* Owner Info Header */}
      {showOwnerInfo && ownerInfo && (
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-white/20">
              <AvatarImage src={ownerInfo.avatar} alt={ownerInfo.name} />
              <AvatarFallback className="bg-[#6E3482] text-white text-xs">
                {ownerInfo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {ownerInfo.name}
              </p>
              {ownerInfo.username && (
                <p className="text-xs text-white/60 truncate">
                  @{ownerInfo.username}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image/Visual Area */}
      <div className="relative">
        <div className="h-32 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Card content"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center`}>
              <span className="text-3xl">{getCategoryIcon(category)}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs px-2 py-1`}>
              {getCategoryLabel(category)}
            </Badge>
          </div>

          {/* Action Buttons - Only for Owner */}
          {isOwner && (
            <>
              {/* Desktop Actions */}
              <motion.div 
                className="absolute top-2 right-2 hidden md:flex gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  scale: isHovered ? 1 : 0.8 
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 text-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </motion.div>

              {/* Mobile Action Menu */}
              <div className="absolute top-2 right-2 md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CardHeader;
