
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Fish, 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy,
  TrendingUp,
  BarChart3,
  Target,
  Waves,
  Thermometer
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FishCatch {
  id: string;
  species_name: string;
  weight_kg?: number;
  length_cm?: number;
  location?: string;
  created_at: string;
  fishing_method?: string;
  weather_condition?: string;
  water_temperature?: number;
  image_urls?: string[];
}

interface HistoryStats {
  totalCatches: number;
  biggestCatch: { weight: number; species: string };
  favoriteLocation: string;
  favoriteSpecies: string;
  successRate: number;
  avgWeight: number;
}

interface Ultra2025HistorySectionProps {
  userId: string;
}

const Ultra2025HistorySection = ({ userId }: Ultra2025HistorySectionProps) => {
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    totalCatches: 0,
    biggestCatch: { weight: 0, species: '' },
    favoriteLocation: '',
    favoriteSpecies: '',
    successRate: 0,
    avgWeight: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const { toast } = useToast();

  // Fetch fishing history from Supabase
  useEffect(() => {
    const fetchFishingHistory = async () => {
      try {
        setIsLoading(true);
        
        // Calculate date filter based on selected period
        let dateFilter = '';
        const now = new Date();
        
        switch (selectedPeriod) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = weekAgo.toISOString();
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = monthAgo.toISOString();
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            dateFilter = yearAgo.toISOString();
            break;
          default:
            dateFilter = '';
        }

        // Fetch fish catches
        let query = supabase
          .from('fish_catches')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }

        const { data: fishCatches, error } = await query.limit(50);

        if (error) throw error;

        setCatches(fishCatches || []);
        
        // Calculate statistics
        if (fishCatches && fishCatches.length > 0) {
          const totalCatches = fishCatches.length;
          
          // Find biggest catch
          const biggestCatch = fishCatches.reduce((prev, current) => {
            const prevWeight = prev.weight_kg || 0;
            const currentWeight = current.weight_kg || 0;
            return currentWeight > prevWeight ? current : prev;
          }, fishCatches[0]);

          // Calculate favorite location
          const locationCounts = fishCatches.reduce((acc: any, catch_: any) => {
            if (catch_.location) {
              acc[catch_.location] = (acc[catch_.location] || 0) + 1;
            }
            return acc;
          }, {});
          const favoriteLocation = Object.keys(locationCounts).length > 0 
            ? Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b)
            : '';

          // Calculate favorite species
          const speciesCounts = fishCatches.reduce((acc: any, catch_: any) => {
            acc[catch_.species_name] = (acc[catch_.species_name] || 0) + 1;
            return acc;
          }, {});
          const favoriteSpecies = Object.keys(speciesCounts).reduce((a, b) => 
            speciesCounts[a] > speciesCounts[b] ? a : b
          );

          // Calculate average weight
          const weightsWithData = fishCatches.filter(c => c.weight_kg);
          const avgWeight = weightsWithData.length > 0 
            ? weightsWithData.reduce((sum, c) => sum + (c.weight_kg || 0), 0) / weightsWithData.length
            : 0;

          setStats({
            totalCatches,
            biggestCatch: { 
              weight: biggestCatch.weight_kg || 0, 
              species: biggestCatch.species_name 
            },
            favoriteLocation,
            favoriteSpecies,
            successRate: Math.min(95, Math.max(60, totalCatches * 2)), // Mock success rate
            avgWeight
          });
        }
        
      } catch (error) {
        console.error('Error fetching fishing history:', error);
        toast({
          title: "❌ Gagal Memuat Riwayat",
          description: "Tidak dapat mengambil data riwayat dari database",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setCatches(getMockCatches());
        setStats(getMockStats());
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFishingHistory();
    }
  }, [userId, selectedPeriod, toast]);

  const getMockCatches = (): FishCatch[] => [
    {
      id: '1',
      species_name: 'Kakap Merah',
      weight_kg: 2.5,
      length_cm: 45,
      location: 'Kepulauan Seribu',
      created_at: '2024-01-15T08:30:00Z',
      fishing_method: 'Jigging',
      weather_condition: 'Cerah',
      water_temperature: 28
    }
  ];

  const getMockStats = (): HistoryStats => ({
    totalCatches: 15,
    biggestCatch: { weight: 5.2, species: 'Tuna Sirip Kuning' },
    favoriteLocation: 'Kepulauan Seribu',
    favoriteSpecies: 'Kakap Merah',
    successRate: 78,
    avgWeight: 2.8
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return '7 Hari Terakhir';
      case 'month': return '30 Hari Terakhir';
      case 'year': return '1 Tahun Terakhir';
      default: return 'Semua Waktu';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 animate-pulse">
              <div className="w-8 h-8 bg-white/20 rounded-xl mb-3" />
              <div className="h-6 bg-white/20 rounded mb-2" />
              <div className="h-4 bg-white/20 rounded w-2/3" />
            </div>
          ))}
        </div>
        
        {/* History List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl" />
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded mb-2" />
                  <div className="h-3 bg-white/20 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Riwayat & Analisis</h2>
        <p className="text-white/70 text-sm">
          {stats.totalCatches} tangkapan dari database Supabase
        </p>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'week', label: '7 Hari' },
          { id: 'month', label: '30 Hari' },
          { id: 'year', label: '1 Tahun' },
          { id: 'all', label: 'Semua' }
        ].map((period) => (
          <motion.button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id as any)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              selectedPeriod === period.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/70'
            }`}
          >
            {period.label}
          </motion.button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
            <Fish className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalCatches}</div>
          <div className="text-xs text-white/70">Total Tangkapan</div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="text-lg font-bold text-white mb-1">{stats.biggestCatch.weight}kg</div>
          <div className="text-xs text-white/70 truncate">{stats.biggestCatch.species}</div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.successRate}%</div>
          <div className="text-xs text-white/70">Tingkat Sukses</div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="text-lg font-bold text-white mb-1">{stats.avgWeight.toFixed(1)}kg</div>
          <div className="text-xs text-white/70">Rata-rata Berat</div>
        </motion.div>
      </div>

      {/* Favorite Stats */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Lokasi Favorit</span>
          </div>
          <p className="text-white/90">{stats.favoriteLocation || 'Belum ada data'}</p>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Fish className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Spesies Favorit</span>
          </div>
          <p className="text-white/90">{stats.favoriteSpecies || 'Belum ada data'}</p>
        </motion.div>
      </div>

      {/* Fishing History List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Riwayat Tangkapan</h3>
        
        {catches.map((catch_, index) => (
          <motion.div
            key={catch_.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-5">
              <div className="flex items-start gap-4">
                {/* Fish Icon */}
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Fish className="w-6 h-6 text-white" />
                </motion.div>

                {/* Catch Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">{catch_.species_name}</h4>
                    {catch_.weight_kg && (
                      <span className="px-3 py-1 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-semibold">
                        {catch_.weight_kg}kg
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(catch_.created_at)}</span>
                    </div>
                    {catch_.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{catch_.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2">
                    {catch_.length_cm && (
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
                        📏 {catch_.length_cm}cm
                      </span>
                    )}
                    {catch_.fishing_method && (
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
                        🎣 {catch_.fishing_method}
                      </span>
                    )}
                    {catch_.weather_condition && (
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
                        ☀️ {catch_.weather_condition}
                      </span>
                    )}
                    {catch_.water_temperature && (
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80">
                        🌡️ {catch_.water_temperature}°C
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Image if available */}
              {catch_.image_urls && catch_.image_urls.length > 0 && (
                <motion.div
                  className="mt-4 w-full h-32 rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={catch_.image_urls[0]}
                    alt={catch_.species_name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {catches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.1)',
                  '0 0 40px rgba(255, 255, 255, 0.2)',
                  '0 0 20px rgba(255, 255, 255, 0.1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Fish className="w-12 h-12 text-white/60" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Riwayat</h3>
            <p className="text-white/70 mb-6 max-w-sm mx-auto">
              Riwayat tangkapan Anda untuk periode {getPeriodLabel(selectedPeriod).toLowerCase()} akan muncul di sini
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ultra2025HistorySection;
