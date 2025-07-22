
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Eye,
  Heart
} from 'lucide-react';

interface MobileStatsGridProps {
  totalPosts: number;
  totalLikes: number;
  totalViews: number;
  totalComments?: number;
}

const MobileStatsGrid = ({ 
  totalPosts, 
  totalLikes, 
  totalViews, 
  totalComments = 0 
}: MobileStatsGridProps) => {
  const stats = [
    {
      icon: Sparkles,
      value: totalPosts,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Heart,
      value: totalLikes,
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-500/20'
    },
    {
      icon: Eye,
      value: totalViews,
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: MessageSquare,
      value: totalComments,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20'
    }
  ];

  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-white leading-none">
                    {stat.value > 999 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileStatsGrid;
