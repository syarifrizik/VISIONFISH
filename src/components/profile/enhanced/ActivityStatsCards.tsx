
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap,
  MessageSquare,
  Heart,
  Trophy,
  Fish
} from 'lucide-react';

interface ActivityStatsCardsProps {
  stats: {
    totalActivities: number;
    activitiesToday: number;
    currentStreak: number;
    totalPoints: number;
    level: number;
    achievements: number;
  };
}

const ActivityStatsCards = ({ stats }: ActivityStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Aktivitas',
      value: stats.totalActivities.toLocaleString(),
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Hari Ini',
      value: stats.activitiesToday.toString(),
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      change: 'Today'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} hari`,
      icon: Target,
      color: 'from-orange-500 to-red-500',
      change: stats.currentStreak > 0 ? '🔥' : '💤'
    },
    {
      title: 'Level & Points',
      value: `Lv.${stats.level}`,
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      change: `${stats.totalPoints.toLocaleString()} pts`
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${card.color} p-4 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <IconComponent className="w-6 h-6" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                      {card.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-white/80 text-sm">{card.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityStatsCards;
