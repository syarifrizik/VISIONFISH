import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Weight, Ruler, Clock, Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { fetchUserFishCatches, updateFishCatch, deleteFishCatch } from '@/services/fishCatchesService';
import AddFishCatchDialog from './AddFishCatchDialog';
import EditFishCatchDialog from './EditFishCatchDialog';

interface FishCatch {
  id: string;
  species_name: string;
  weight_kg?: number;
  length_cm?: number;
  location?: string;
  catch_time?: string;
  created_at: string;
  image_urls?: string[];
  notes?: string;
  is_released: boolean;
  is_record: boolean;
  fishing_method?: string;
  bait_used?: string;
  weather_condition?: string;
  is_private?: boolean;
}

interface FishCatchHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  isOwnProfile?: boolean;
}

const FishCatchHistoryDialog = ({ open, onOpenChange, userId, isOwnProfile = false }: FishCatchHistoryDialogProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCatch, setEditingCatch] = useState<FishCatch | null>(null);

  const isOwner = user?.id === userId;

  useEffect(() => {
    if (open) {
      loadCatches();
    }
  }, [open, userId]);

  const loadCatches = async () => {
    setLoading(true);
    try {
      const data = await fetchUserFishCatches(userId, 50);
      setCatches(data);
    } catch (error) {
      console.error('Error loading fish catches:', error);
      showNotification('Gagal memuat data tangkapan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivacy = async (catchId: string, isPrivate: boolean) => {
    try {
      const result = await updateFishCatch(catchId, { is_private: isPrivate });
      if (result.success) {
        setCatches(prev => prev.map(c => 
          c.id === catchId ? { ...c, is_private: isPrivate } : c
        ));
        showNotification(
          isPrivate ? 'Tangkapan dijadikan privat' : 'Tangkapan dijadikan publik', 
          'success'
        );
      } else {
        showNotification('Gagal mengubah status privasi', 'error');
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      showNotification('Terjadi kesalahan', 'error');
    }
  };

  const handleEditCatch = (catchItem: FishCatch) => {
    setEditingCatch(catchItem);
    setShowEditDialog(true);
  };

  const handleDeleteCatch = async (catchId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tangkapan ini?')) return;

    try {
      const result = await deleteFishCatch(catchId);
      if (result.success) {
        setCatches(prev => prev.filter(c => c.id !== catchId));
        showNotification('Tangkapan berhasil dihapus', 'success');
      } else {
        showNotification('Gagal menghapus tangkapan', 'error');
      }
    } catch (error) {
      console.error('Error deleting catch:', error);
      showNotification('Terjadi kesalahan saat menghapus', 'error');
    }
  };

  const handleCatchAdded = () => {
    loadCatches();
    setShowAddDialog(false);
  };

  const handleCatchUpdated = () => {
    loadCatches();
    setShowEditDialog(false);
    setEditingCatch(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border-[#A56ABD]/30 text-white">
          <DialogHeader className="border-b border-[#A56ABD]/20 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-[#F5EBFA] flex items-center gap-2">
                🎣 Riwayat Tangkapan
              </DialogTitle>
              {isOwner && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  size="sm"
                  className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tangkapan
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 animate-pulse">
                    <div className="h-6 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : catches.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎣</div>
                <h3 className="text-xl font-semibold text-[#F5EBFA] mb-2">
                  Belum ada tangkapan
                </h3>
                <p className="text-[#A56ABD]">
                  {isOwner ? 'Mulai catat tangkapan ikan Anda!' : 'User ini belum mencatat tangkapan apapun'}
                </p>
                {isOwner && (
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="mt-4 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tangkapan Pertama
                  </Button>
                )}
              </div>
            ) : (
              <AnimatePresence>
                {catches.map((catchItem, index) => (
                  <motion.div
                    key={catchItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20 hover:bg-white/10 transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#F5EBFA] text-lg mb-1">
                              {catchItem.species_name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-[#A56ABD]">
                              <Calendar className="w-4 h-4" />
                              {formatDate(catchItem.created_at)}
                              {catchItem.catch_time && (
                                <>
                                  <Clock className="w-4 h-4 ml-2" />
                                  {catchItem.catch_time}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action buttons and privacy toggle */}
                          <div className="flex items-center gap-2">
                            {/* Privacy toggle - only for owner */}
                            {isOwner && (
                              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
                                <div className="flex items-center gap-1 text-xs">
                                  {catchItem.is_private ? (
                                    <EyeOff className="w-3 h-3 text-orange-400" />
                                  ) : (
                                    <Eye className="w-3 h-3 text-green-400" />
                                  )}
                                  <span className="text-[#E7D7EF]">
                                    {catchItem.is_private ? 'Privat' : 'Publik'}
                                  </span>
                                </div>
                                <Switch
                                  checked={!catchItem.is_private}
                                  onCheckedChange={(checked) => handleTogglePrivacy(catchItem.id, !checked)}
                                  className="scale-75"
                                />
                              </div>
                            )}

                            {/* Edit and Delete buttons - only for owner */}
                            {isOwner && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-[#A56ABD] hover:text-white hover:bg-[#A56ABD]/20"
                                  onClick={() => handleEditCatch(catchItem)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-500/20"
                                  onClick={() => handleDeleteCatch(catchItem.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}

                            {/* Privacy indicator for non-owners */}
                            {!isOwner && catchItem.is_private && (
                              <Badge variant="outline" className="border-orange-400 text-orange-400">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Privat
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Catch details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {catchItem.weight_kg && (
                            <div className="flex items-center gap-2 text-sm">
                              <Weight className="w-4 h-4 text-[#A56ABD]" />
                              <span className="text-[#E7D7EF]">{catchItem.weight_kg} kg</span>
                            </div>
                          )}
                          {catchItem.length_cm && (
                            <div className="flex items-center gap-2 text-sm">
                              <Ruler className="w-4 h-4 text-[#A56ABD]" />
                              <span className="text-[#E7D7EF]">{catchItem.length_cm} cm</span>
                            </div>
                          )}
                          {catchItem.location && (
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <MapPin className="w-4 h-4 text-[#A56ABD]" />
                              <span className="text-[#E7D7EF] truncate">{catchItem.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Additional info */}
                        <div className="space-y-2">
                          {catchItem.fishing_method && (
                            <div className="text-sm">
                              <span className="text-[#A56ABD]">Metode: </span>
                              <span className="text-[#E7D7EF]">{catchItem.fishing_method}</span>
                            </div>
                          )}
                          {catchItem.bait_used && (
                            <div className="text-sm">
                              <span className="text-[#A56ABD]">Umpan: </span>
                              <span className="text-[#E7D7EF]">{catchItem.bait_used}</span>
                            </div>
                          )}
                          {catchItem.notes && (
                            <div className="text-sm">
                              <span className="text-[#A56ABD]">Catatan: </span>
                              <span className="text-[#E7D7EF]">{catchItem.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 mt-3">
                          {catchItem.is_released && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Dilepas
                            </Badge>
                          )}
                          {catchItem.is_record && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Rekor Pribadi
                            </Badge>
                          )}
                        </div>

                        {/* Images */}
                        {catchItem.image_urls && catchItem.image_urls.length > 0 && (
                          <div className="mt-3">
                            <div className="grid grid-cols-3 gap-2">
                              {catchItem.image_urls.slice(0, 3).map((url, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={url}
                                  alt={`${catchItem.species_name} ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                            {catchItem.image_urls.length > 3 && (
                              <p className="text-xs text-[#A56ABD] mt-1">
                                +{catchItem.image_urls.length - 3} foto lainnya
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Fish Catch Dialog */}
      <AddFishCatchDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCatchAdded={handleCatchAdded}
      />

      {/* Edit Fish Catch Dialog */}
      <EditFishCatchDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditingCatch(null);
        }}
        catchData={editingCatch}
        onCatchUpdated={handleCatchUpdated}
      />
    </>
  );
};

export default FishCatchHistoryDialog;
