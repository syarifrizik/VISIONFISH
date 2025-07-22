
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Fish, Award, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  totalCatches: number;
  totalWeight: number;
  biggestCatch: {
    species_name: string;
    weight_kg: number;
  } | null;
  speciesCount: number;
  recordCatches: number;
}

interface MobileEnhancedStatsProps {
  userId: string;
  isCompact?: boolean;
}

const MobileEnhancedStats = ({ userId, isCompact = false }: MobileEnhancedStatsProps) => {
  const [stats, setStats] = useState<StatsData>({
    totalCatches: 0,
    totalWeight: 0,
    biggestCatch: null,
    speciesCount: 0,
    recordCatches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  const loadStats = async () => {
    try {
      const { data: fishCatches, error } = await supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const catches = fishCatches || [];
      const totalCatches = catches.length;
      const totalWeight = catches.reduce((sum, catch_) => sum + (catch_.weight_kg || 0), 0);
      const biggestCatch = catches.reduce((max, catch_) => 
        (catch_.weight_kg || 0) > (max?.weight_kg || 0) ? catch_ : max, null);
      
      const speciesCount = new Set(catches.map(c => c.species_name)).size;
      const recordCatches = catches.filter(c => c.is_record).length;

      setStats({
        totalCatches,
        totalWeight: Math.round(totalWeight * 100) / 100,
        biggestCatch,
        speciesCount,
        recordCatches
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20 animate-pulse">
        <CardContent className="p-4">
          <div className="h-20 bg-white/10 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-[#A56ABD]" />
          <h3 className="font-semibold text-[#F5EBFA]">Statistik Memancing</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-[#A56ABD]">Total Tangkapan</p>
            <p className="text-lg font-bold text-[#F5EBFA]">{stats.totalCatches}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-[#A56ABD]">Total Berat</p>
            <p className="text-lg font-bold text-[#F5EBFA]">{stats.totalWeight} kg</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-[#A56ABD]">Spesies Berbeda</p>
            <p className="text-lg font-bold text-[#F5EBFA]">{stats.speciesCount}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-[#A56ABD]">Rekor Pribadi</p>
            <p className="text-lg font-bold text-[#F5EBFA]">{stats.recordCatches}</p>
          </div>
        </div>

        {stats.biggestCatch && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-[#A56ABD] mb-1">Tangkapan Terbesar</p>
            <div className="flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#A56ABD]" />
              <span className="text-sm font-medium text-[#F5EBFA]">
                {stats.biggestCatch.species_name} ({stats.biggestCatch.weight_kg} kg)
              </span>
            </div>
          </div>
        )}

        {isCompact && (
          <div className="mt-4">
            <p className="text-xs text-[#A56ABD]">Compact view mode</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileEnhancedStats;
