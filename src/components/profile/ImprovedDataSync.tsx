
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileStats } from '@/types/profile';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ImprovedDataSyncProps {
  userId: string;
  onStatsUpdate: (stats: ProfileStats) => void;
  currentStats: ProfileStats;
}

const ImprovedDataSync = ({
  userId,
  onStatsUpdate,
  currentStats
}: ImprovedDataSyncProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { toast } = useToast();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Quick sync on reconnect if needed
      if (lastSync && Date.now() - lastSync.getTime() > 60000) {
        syncDataQuick();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lastSync]);

  // Real-time subscriptions - simplified
  useEffect(() => {
    if (!userId || !isOnline) return;
    
    let channels: any[] = [];
    
    const subscribeToRealtime = () => {
      try {
        // Subscribe to fish catches only (most important)
        const catchesChannel = supabase.channel(`profile-catches-${userId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'fish_catches',
            filter: `user_id=eq.${userId}`
          }, () => {
            console.log('Fish catches update detected');
            syncDataQuick();
          })
          .subscribe();

        channels = [catchesChannel];
      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
      }
    };
    
    subscribeToRealtime();

    return () => {
      channels.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
    };
  }, [userId, isOnline]);

  // Quick data synchronization function
  const syncDataQuick = async (forceSync = false) => {
    if (!userId || (!isOnline && !forceSync)) return;
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);
    
    try {
      console.log('Quick sync for user:', userId);

      // Only fetch essential stats quickly
      const [fishCatchesResult, notesResult] = await Promise.allSettled([
        supabase.from('fish_catches').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', userId)
      ]);

      const fishCatches = fishCatchesResult.status === 'fulfilled' ? (fishCatchesResult.value.count || 0) : currentStats.total_catches;
      const notes = notesResult.status === 'fulfilled' ? (notesResult.value.count || 0) : 0;

      const newStats: ProfileStats = {
        total_catches: fishCatches,
        total_posts: notes,
        followers_count: currentStats.followers_count, // Keep existing
        following_count: currentStats.following_count  // Keep existing
      };

      // Only update if there's a meaningful change
      if (newStats.total_catches !== currentStats.total_catches || 
          newStats.total_posts !== currentStats.total_posts) {
        onStatsUpdate(newStats);
        setLastSync(new Date());
        
        if (forceSync) {
          toast({
            title: "✨ Data Disinkronkan!",
            description: "Statistik profil telah diperbarui"
          });
        }
      }

      console.log('Quick sync completed:', newStats);
    } catch (error) {
      console.error('Error in quick sync:', error);
      setSyncError('Gagal memperbarui data');
      
      if (forceSync) {
        toast({
          title: "⚠️ Sinkronisasi Gagal",
          description: "Tidak dapat memperbarui data saat ini",
          variant: "destructive"
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto sync every 2 minutes when online (reduced frequency)
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      syncDataQuick();
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [isOnline, userId]);

  const handleManualSync = () => {
    syncDataQuick(true);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status Indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center"
      >
        {isOnline ? (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Offline</span>
          </div>
        )}
      </motion.div>

      {/* Sync Status */}
      <AnimatePresence mode="wait">
        {isSyncing ? (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 hidden sm:inline">
              Sinkronisasi...
            </span>
          </motion.div>
        ) : syncError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs text-red-600 dark:text-red-400 hidden sm:inline">
              Error
            </span>
          </motion.div>
        ) : lastSync ? (
          <motion.div
            key="synced"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">
              Tersinkron
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Manual Sync Button */}
      {isOnline && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="h-6 w-6 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          title="Sinkronkan data secara manual"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
        </Button>
      )}

      {/* Last Sync Time */}
      {lastSync && !isSyncing && (
        <Badge variant="outline" className="text-xs bg-white/50 dark:bg-gray-800/50">
          {new Date(lastSync).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Badge>
      )}
    </div>
  );
};

export default ImprovedDataSync;
