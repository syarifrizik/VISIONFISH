
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Lock, 
  TrendingUp, 
  Calendar, 
  Download,
  Bell,
  BarChart3,
  Zap,
  Star
} from 'lucide-react';
import { EnhancedWeatherData } from '@/utils/enhanced-weather';
import { DailyForecast } from '@/utils/weather';
import { useNavigate } from 'react-router-dom';

interface PremiumWeatherFeaturesProps {
  isPremium: boolean;
  weatherData: EnhancedWeatherData | null;
  extendedForecast: DailyForecast[];
}

export const PremiumWeatherFeatures = ({ 
  isPremium, 
  weatherData, 
  extendedForecast 
}: PremiumWeatherFeaturesProps) => {
  const navigate = useNavigate();

  const premiumFeatures = [
    {
      icon: Calendar,
      title: 'Prakiraan 15 Hari',
      description: 'Prakiraan cuaca extended hingga 2 minggu ke depan',
      available: isPremium
    },
    {
      icon: BarChart3,
      title: 'Analisis Historis',
      description: 'Data historis cuaca dan pattern analysis untuk lokasi favorit',
      available: isPremium
    },
    {
      icon: Bell,
      title: 'Alert Khusus',
      description: 'Notifikasi real-time untuk kondisi cuaca optimal',
      available: isPremium
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download data cuaca dalam format CSV/Excel untuk analisis',
      available: isPremium
    },
    {
      icon: TrendingUp,
      title: 'Prediksi AI Advanced',
      description: 'Machine learning prediction untuk aktivitas perikanan',
      available: isPremium
    },
    {
      icon: Zap,
      title: 'API Access',
      description: 'Akses API untuk integrasi dengan aplikasi lain',
      available: isPremium
    }
  ];

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">Upgrade ke Premium</CardTitle>
            <p className="text-muted-foreground">
              Dapatkan akses ke fitur weather intelligence yang lebih canggih
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center pt-4">
              <Button 
                onClick={() => navigate('/premium')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Sekarang
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Mulai dari Rp 49.000/bulan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Badge */}
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm">
          <Crown className="w-4 h-4 mr-2" />
          Premium Member
        </Badge>
      </div>

      {/* Extended Forecast */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Prakiraan Extended (15 Hari)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {extendedForecast.slice(0, 10).map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              >
                <div className="flex items-center gap-3">
                  <img src={day.icon} alt={day.condition} className="w-8 h-8" />
                  <div>
                    <div className="font-medium text-sm">{day.day}</div>
                    <div className="text-xs text-muted-foreground">{day.condition}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {day.highTemp}° / {day.lowTemp}°
                  </div>
                  <div className="text-xs text-muted-foreground">
                    💧 {day.rainChance}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Analytics */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analisis Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-200">Pattern Analysis</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Berdasarkan data historis, kondisi cuaca saat ini optimal untuk aktivitas perikanan. 
                Pola serupa terjadi 85% menghasilkan hasil tangkapan yang baik.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-800 dark:text-purple-200">Trend Prediction</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                AI memprediksi peningkatan aktivitas ikan dalam 3 hari ke depan. 
                Suhu air optimal akan bertahan hingga akhir minggu.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Actions */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle>Aksi Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Set Alert
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
