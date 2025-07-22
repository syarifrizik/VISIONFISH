
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Share2, 
  MoreHorizontal, 
  Edit3, 
  Fish, 
  StickyNote,
  Camera,
  Trophy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface ProfileActionsProps {
  layout?: 'mobile' | 'desktop';
  isOwnProfile?: boolean;
  onAddCatch?: () => void;
  onAddNote?: () => void;
  onEditProfile?: () => void;
  onShare?: () => void;
}

const ProfileActions = ({ 
  layout = 'mobile', 
  isOwnProfile = false,
  onAddCatch,
  onAddNote,
  onEditProfile,
  onShare
}: ProfileActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Profil VisionFish',
        text: 'Lihat profil saya di VisionFish',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.();
  };

  if (layout === 'mobile') {
    return (
      <div className="flex items-center gap-2">
        {isOwnProfile ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-[#A56ABD]/30 hover:bg-[#A56ABD]/10"
              >
                <MoreHorizontal className="w-4 h-4 text-[#6E3482]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onAddCatch} className="cursor-pointer">
                <Fish className="w-4 h-4 mr-2" />
                Tambah Tangkapan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddNote} className="cursor-pointer">
                <StickyNote className="w-4 h-4 mr-2" />
                Tambah Catatan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEditProfile} className="cursor-pointer">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 px-3 border-[#A56ABD]/30 hover:bg-[#A56ABD]/10"
          >
            <Share2 className="w-3 h-3 mr-1" />
            <span className="text-xs">Bagikan</span>
          </Button>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex items-center gap-3">
      {isOwnProfile ? (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onAddCatch}
              size="sm"
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white shadow-lg"
            >
              <Fish className="w-4 h-4 mr-2" />
              Tambah Tangkapan
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onAddNote}
              variant="outline"
              size="sm"
              className="border-[#A56ABD]/30 text-[#6E3482] hover:bg-[#A56ABD]/10"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Tambah Catatan
            </Button>
          </motion.div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-[#A56ABD]/30 hover:bg-[#A56ABD]/10"
              >
                <MoreHorizontal className="w-4 h-4 text-[#6E3482]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onEditProfile} className="cursor-pointer">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Camera className="w-4 h-4 mr-2" />
                Ganti Foto Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Trophy className="w-4 h-4 mr-2" />
                Kelola Pencapaian
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan Privasi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-[#A56ABD]/30 text-[#6E3482] hover:bg-[#A56ABD]/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Bagikan Profil
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
