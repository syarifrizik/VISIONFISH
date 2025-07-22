import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Flame, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { useEnhancedActivityFeed } from '@/hooks/useEnhancedActivityFeed';
import { useActivityStreaks } from '@/hooks/useActivityStreaks';
import { useGamification } from '@/hooks/useGamification';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ImprovedActivityFeed from './ImprovedActivityFeed';

const EnhancedActivityFeed = () => {
  const { activities, isLoading: activitiesLoading } = useEnhancedActivityFeed();
  const { streaks, personalRecords, isLoading: streaksLoading } = useActivityStreaks();
  const { achievements, totalPoints, level, isLoading: gamificationLoading } = useGamification();

  const getStreakIcon = (streakType: string) => {
    switch (streakType) {
      case 'message_sent': return '💬';
      case 'fish_caught': return '🎣';
      case 'note_created': return '📝';
      case 'community_post_created': return '📱';
      default: return '⚡';
    }
  };

  const getStreakName = (streakType: string) => {
    switch (streakType) {
      case 'message_sent': return 'Chat Streak';
      case 'fish_caught': return 'Fishing Streak';
      case 'note_created': return 'Notes Streak';
      case 'community_post_created': return 'Social Streak';
      default: return 'Activity Streak';
    }
  };

  if (activitiesLoading || streaksLoading || gamificationLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gamification Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Level {level} Fisher</h2>
              <p className="text-purple-100">{totalPoints.toLocaleString()} Points</p>
            </div>
            <div className="text-right">
              <Trophy className="w-12 h-12 mb-2 mx-auto" />
              <p className="text-sm">Next Level: {((level * 1000) - totalPoints).toLocaleString()} pts</p>
            </div>
          </div>
          <Progress 
            value={(totalPoints % 1000) / 10} 
            className="mt-4 bg-purple-600"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Streaks
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Records
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Activity Feed Tab - NEW IMPROVED VERSION */}
        <TabsContent value="feed" className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Aktivitas Terbaru
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Riwayat lengkap semua aktivitas Anda
              </p>
            </div>
            <div className="p-6">
              <ImprovedActivityFeed />
            </div>
          </div>
        </TabsContent>

        {/* Streaks Tab */}
        <TabsContent value="streaks" className="space-y-4">
          {streaks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Belum Ada Streak
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mulai beraktivitas konsisten untuk membangun streak!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {streaks.map((streak, index) => (
                <motion.div
                  key={streak.streak_type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getStreakIcon(streak.streak_type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {getStreakName(streak.streak_type)}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Terakhir: {formatDistanceToNow(new Date(streak.last_activity_date), {
                                addSuffix: true,
                                locale: idLocale
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{streak.current_streak}</div>
                          <div className="text-xs text-orange-600">Current</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{streak.longest_streak}</div>
                          <div className="text-xs text-blue-600">Best</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-md transition-all ${
                  achievement.isUnlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200' 
                    : 'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${achievement.isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.isUnlocked && (
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className={achievement.isUnlocked ? 'bg-yellow-200' : ''}
                      />
                    </div>
                    
                    {achievement.unlockedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Unlocked: {formatDistanceToNow(new Date(achievement.unlockedAt), {
                          addSuffix: true,
                          locale: idLocale
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Personal Records Tab */}
        <TabsContent value="records" className="space-y-4">
          {personalRecords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Belum Ada Record
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mulai mencatat pencapaian terbaik Anda!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {personalRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {record.record_type}
                            </h4>
                            <p className="text-sm text-gray-500">{record.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {record.record_value.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(record.record_date), {
                              addSuffix: true,
                              locale: idLocale
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedActivityFeed;
