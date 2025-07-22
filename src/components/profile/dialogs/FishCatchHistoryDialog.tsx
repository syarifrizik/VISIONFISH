
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { History, Fish, MapPin, Calendar, Weight, Ruler } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface FishCatch {
  id: string;
  species_name: string;
  weight_kg: number | null;
  length_cm: number | null;
  location: string | null;
  bait_used: string | null;
  notes: string | null;
  created_at: string;
}

interface FishCatchHistoryDialogProps {
  totalCatches: number;
}

const FishCatchHistoryDialog = ({ totalCatches }: FishCatchHistoryDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCatches(data || []);
    } catch (error) {
      console.error('Error loading catches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadCatches();
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
        >
          <History className="w-4 h-4 mr-1" />
          Lihat Riwayat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-100">
            <Fish className="w-6 h-6" />
            Riwayat Tangkapan ({totalCatches})
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : catches.length === 0 ? (
            <div className="text-center py-8">
              <Fish className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Belum ada tangkapan yang tercatat</p>
            </div>
          ) : (
            <div className="space-y-4">
              {catches.map((catchItem, index) => (
                <motion.div
                  key={catchItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {catchItem.species_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(new Date(catchItem.created_at), {
                            addSuffix: true,
                            locale: idLocale
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      #{catches.length - index}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {catchItem.weight_kg && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Weight className="w-4 h-4 text-blue-600" />
                        <span>{catchItem.weight_kg} kg</span>
                      </div>
                    )}
                    {catchItem.length_cm && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Ruler className="w-4 h-4 text-blue-600" />
                        <span>{catchItem.length_cm} cm</span>
                      </div>
                    )}
                  </div>

                  {catchItem.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{catchItem.location}</span>
                    </div>
                  )}

                  {catchItem.bait_used && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        Umpan: {catchItem.bait_used}
                      </Badge>
                    </div>
                  )}

                  {catchItem.notes && (
                    <div className="mt-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {catchItem.notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FishCatchHistoryDialog;
