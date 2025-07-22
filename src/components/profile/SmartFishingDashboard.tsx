
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Fish, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Waves,
  Target,
  Activity
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';

interface SmartFishingDashboardProps {
  user: UserProfile;
  stats: ProfileStats;
}

const SmartFishingDashboard = ({ user, stats }: SmartFishingDashboardProps) => {
  return (
    <div className="space-y-4">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
              <Fish className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Total Catch</p>
              <p className="text-lg font-bold text-white">{stats.total_catches}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Active Days</p>
              <p className="text-lg font-bold text-white">24</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Achievement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-white">Pencapaian Terbaru</span>
          </div>
          <Badge className="bg-amber-500/30 text-amber-200 border-amber-500/30">
            Baru
          </Badge>
        </div>
        
        <h3 className="text-white font-semibold mb-1">Master Angler</h3>
        <p className="text-sm text-white/70">
          Berhasil menangkap 50+ ikan dalam sebulan
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex-col h-auto py-3"
          >
            <Fish className="w-4 h-4 mb-1" />
            <span className="text-xs">Log Catch</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex-col h-auto py-3"
          >
            <MapPin className="w-4 h-4 mb-1" />
            <span className="text-xs">Find Spots</span>
          </Button>
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-400" />
            <span className="text-sm font-medium text-white">Kondisi Memancing</span>
          </div>
          <Badge className="bg-green-500/30 text-green-200 border-green-500/30">
            Baik
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">28°C</p>
            <p className="text-xs text-white/70">Cerah berawan</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Angin</p>
            <p className="text-sm text-white">5 km/h</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartFishingDashboard;
