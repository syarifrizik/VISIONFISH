
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, User, MapPin, Hash, FileText, Scale, Trophy, Activity as ActivityIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    id: string;
    activity_type: string;
    created_at: string;
    metadata?: any;
    action_details?: {
      item_type?: string;
      item_title?: string;
      changes?: string[];
      location?: string;
      image_count?: number;
      target_user?: string;
      species?: string;
      weight?: number;
    };
  } | null;
}

const ActivityDetailModal = ({ isOpen, onClose, activity }: ActivityDetailModalProps) => {
  if (!activity) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_updated':
        return <User className="w-5 h-5" />;
      case 'content_created':
        return <FileText className="w-5 h-5" />;
      case 'note_created':
        return <FileText className="w-5 h-5" />;
      case 'fish_caught':
        return <Trophy className="w-5 h-5" />;
      case 'community_post_created':
        return <Hash className="w-5 h-5" />;
      case 'achievement_earned':
        return <Trophy className="w-5 h-5" />;
      default:
        return <ActivityIcon className="w-5 h-5" />;
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'profile_updated':
        return 'Pembaruan Profil';
      case 'content_created':
        return 'Konten Dibuat';
      case 'note_created':
        return 'Catatan Dibuat';
      case 'fish_caught':
        return 'Ikan Tertangkap';
      case 'community_post_created':
        return 'Postingan Komunitas';
      case 'achievement_earned':
        return 'Pencapaian Diraih';
      default:
        return 'Detail Aktivitas';
    }
  };

  const renderDetailContent = () => {
    const details = activity.action_details;
    const metadata = activity.metadata;

    return (
      <div className="space-y-4">
        {/* Basic Info */}
        <Card className="bg-white/5 border-[#A56ABD]/30">
          <CardContent className="p-4">
            <h4 className="font-medium text-[#F5EBFA] mb-3">Informasi Dasar</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A56ABD]">Waktu:</span>
                <span className="text-[#E7D0EF]">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                    locale: idLocale
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A56ABD]">Tanggal:</span>
                <span className="text-[#E7D0EF]">
                  {new Date(activity.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Specific Details */}
        {details?.item_title && (
          <Card className="bg-white/5 border-[#A56ABD]/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-[#F5EBFA] mb-3">Detail Konten</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A56ABD]">Judul:</span>
                  <span className="text-[#E7D0EF] font-medium">{details.item_title}</span>
                </div>
                {details.item_type && (
                  <div className="flex justify-between">
                    <span className="text-[#A56ABD]">Tipe:</span>
                    <Badge className="bg-[#6E3482] text-white text-xs">
                      {details.item_type}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Changes */}
        {details?.changes && details.changes.length > 0 && (
          <Card className="bg-white/5 border-[#A56ABD]/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-[#F5EBFA] mb-3">Perubahan Profil</h4>
              <div className="space-y-1">
                {details.changes.map((change, index) => (
                  <Badge key={index} className="bg-[#A56ABD]/20 text-[#E7D0EF] text-xs mr-2">
                    {change}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fish Catch Details */}
        {details?.species && (
          <Card className="bg-white/5 border-[#A56ABD]/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-[#F5EBFA] mb-3">Detail Tangkapan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A56ABD]">Spesies:</span>
                  <span className="text-[#E7D0EF] font-medium">{details.species}</span>
                </div>
                {details.weight && (
                  <div className="flex justify-between">
                    <span className="text-[#A56ABD]">Berat:</span>
                    <span className="text-[#E7D0EF]">{details.weight} kg</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {details?.location && (
          <Card className="bg-white/5 border-[#A56ABD]/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-[#F5EBFA] mb-3">Lokasi</h4>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#A56ABD]" />
                <span className="text-[#E7D0EF]">{details.location}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        {metadata && Object.keys(metadata).length > 0 && (
          <Card className="bg-white/5 border-[#A56ABD]/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-[#F5EBFA] mb-3">Data Tambahan</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[#A56ABD] capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-[#E7D0EF]">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#49225B] to-[#6E3482] border-[#A56ABD]/20 text-[#F5EBFA] max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F5EBFA] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#6E3482] to-[#A56ABD]">
              {getActivityIcon(activity.activity_type)}
            </div>
            {getActivityTitle(activity.activity_type)}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {renderDetailContent()}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-[#6E3482] hover:bg-[#49225B] text-[#F5EBFA]"
          >
            <X className="w-4 h-4 mr-2" />
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;
