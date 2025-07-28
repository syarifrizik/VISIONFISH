
import React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import StatCard from "@/components/fish-analysis/StatCard";
import HorizontalCardScroller from "@/components/fish-analysis/HorizontalCardScroller";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

// Define the proper types for the data
interface RadarDataPoint {
  subject: string;
  A: number; 
  fullMark: number;
}

interface SummarySectionProps {
  dominantCategory: string;
  avgScore: number;
  bestParameter: { parameter: string; score: number };
  resultsCount: number;
  pieChartData: Array<{ name: string; value: number }>;
  radarDataFormatted: RadarDataPoint[];
  fishName: string;
}

const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#9E9E9E'];
const CATEGORY_COLORS = {
  'Prima': '#2196F3', // Blue
  'Advance': '#4CAF50', // Green
  'Sedang': '#FF9800', // Orange
  'Busuk': '#F44336',  // Red
  'Invalid': '#9E9E9E' // Grey
};

const SummarySection: React.FC<SummarySectionProps> = ({
  dominantCategory,
  avgScore,
  bestParameter,
  resultsCount,
  pieChartData,
  radarDataFormatted,
  fishName,
}) => {
  const isMobile = useIsMobile();
  
  const stats = [
    {
      title: "Skor Rata-rata",
      value: avgScore,
      description: "dari 9",
      colorAccent: "from-visionfish-neon-blue/5 to-transparent"
    },
    {
      title: "Status Dominan",
      value: dominantCategory,
      colorAccent: "from-visionfish-neon-pink/5 to-transparent"
    },
    {
      title: "Parameter Terbaik",
      value: bestParameter.parameter,
      description: `Skor: ${bestParameter.score}`,
      colorAccent: "from-green-500/5 to-transparent"
    }
  ];

  // Enhanced pie chart with custom rendering
  const renderCustomizedPieLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card className="fish-analysis-card border border-visionfish-neon-blue/20 overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-visionfish-neon-blue/10 to-transparent border-b border-visionfish-neon-blue/10">
        <CardTitle>Ringkasan Penilaian</CardTitle>
        <CardDescription>
          {resultsCount} sampel dianalisis {fishName && `untuk ikan ${fishName}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {isMobile ? (
          <HorizontalCardScroller cardWidth="200px">
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                title={stat.title} 
                value={stat.value} 
                description={stat.description}
                colorAccent={stat.colorAccent}
              />
            ))}
          </HorizontalCardScroller>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                title={stat.title} 
                value={stat.value} 
                description={stat.description}
                colorAccent={stat.colorAccent}
              />
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background/30 backdrop-blur-sm rounded-lg p-4 border border-visionfish-neon-blue/20"
          >
            <h3 className="font-medium mb-4">Distribusi Kesegaran</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedPieLabel}
                    className="pie-segment"
                  >
                    {pieChartData.map((entry, index) => {
                      // Use category-specific colors when available
                      const color = CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || 
                                   COLORS[index % COLORS.length];
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    payload={
                      pieChartData.map((entry, index) => {
                        const color = CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || 
                                     COLORS[index % COLORS.length];
                        return {
                          value: `${entry.name}: ${entry.value} (${((entry.value / resultsCount) * 100).toFixed(0)}%)`,
                          type: 'circle',
                          id: entry.name,
                          color: color,
                        };
                      })
                    }
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => [`${value} sampel (${((value as number / resultsCount) * 100).toFixed(0)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-background/30 backdrop-blur-sm rounded-lg p-4 border border-visionfish-neon-blue/20"
          >
            <h3 className="font-medium mb-4">Profil Kualitas Ikan</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarDataFormatted}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 9]} />
                  <Radar
                    name="Skor Parameter"
                    dataKey="A"
                    stroke="#00B7EB"
                    fill="#00B7EB"
                    fillOpacity={0.3}
                    className="radar-chart-line"
                  />
                  <RechartsTooltip formatter={(value) => [`${value}/9`, 'Skor']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
