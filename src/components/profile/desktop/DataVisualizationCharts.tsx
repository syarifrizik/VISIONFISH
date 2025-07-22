
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Fish, Calendar, MapPin } from 'lucide-react';

interface DataVisualizationChartsProps {
  profileStats: any;
}

const DataVisualizationCharts = ({ profileStats }: DataVisualizationChartsProps) => {
  // Mock data for visualization
  const catchesData = [
    { month: 'Jan', catches: 12, locations: 3 },
    { month: 'Feb', catches: 19, locations: 4 },
    { month: 'Mar', catches: 15, locations: 2 },
    { month: 'Apr', catches: 25, locations: 5 },
    { month: 'May', catches: 22, locations: 4 },
    { month: 'Jun', catches: 30, locations: 6 },
  ];

  const fishTypeData = [
    { name: 'Nila', value: 35, color: '#06b6d4' },
    { name: 'Lele', value: 25, color: '#8b5cf6' },
    { name: 'Mas', value: 20, color: '#10b981' },
    { name: 'Patin', value: 12, color: '#f59e0b' },
    { name: 'Lainnya', value: 8, color: '#ef4444' },
  ];

  const activityData = [
    { day: 'Sen', activity: 8 },
    { day: 'Sel', activity: 12 },
    { day: 'Rab', activity: 6 },
    { day: 'Kam', activity: 15 },
    { day: 'Jum', activity: 10 },
    { day: 'Sab', activity: 20 },
    { day: 'Min', activity: 18 },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Catches Trend Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <TrendingUp className="w-5 h-5" />
              Trend Tangkapan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={catchesData}>
                <defs>
                  <linearGradient id="catchesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="catches" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#catchesGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fish Type Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-300">
              <Fish className="w-5 h-5" />
              Distribusi Jenis Ikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fishTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {fishTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {fishTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-white/70">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-green-300">
              <Calendar className="w-5 h-5" />
              Aktivitas Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="activity" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Statistics */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <MapPin className="w-5 h-5" />
              Lokasi Memancing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={catchesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="locations" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataVisualizationCharts;
