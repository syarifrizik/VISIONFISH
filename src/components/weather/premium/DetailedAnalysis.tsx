import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BarChart, LineChart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Download, Share } from 'lucide-react';
import { motion } from 'framer-motion';
import { WeatherData } from '@/utils/weather';

interface DetailedAnalysisProps {
  weather: WeatherData | null;
}

export const DetailedAnalysis = ({ weather }: DetailedAnalysisProps) => {
  if (!weather) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Analisis Detail</span>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Data cuaca tidak tersedia</p>
        </CardContent>
      </Card>
    );
  }

  const getTemperatureAnalysis = () => {
    const temp = weather.temperature;
    if (temp < 20) return { status: 'cold', icon: TrendingDown, color: 'blue', text: 'Suhu rendah, berpotensi mempengaruhi aktivitas outdoor' };
    if (temp < 30) return { status: 'normal', icon: CheckCircle, color: 'green', text: 'Suhu ideal untuk berbagai aktivitas' };
    if (temp < 35) return { status: 'warm', icon: TrendingUp, color: 'orange', text: 'Suhu tinggi, disarankan mengurangi aktivitas outdoor' };
    return { status: 'hot', icon: AlertTriangle, color: 'red', text: 'Suhu sangat tinggi, hindari paparan langsung' };
  };

  const getHumidityAnalysis = () => {
    const humidity = weather.humidity;
    if (humidity < 30) return { status: 'low', text: 'Kelembaban rendah, udara kering' };
    if (humidity < 70) return { status: 'normal', text: 'Kelembaban normal, nyaman untuk aktivitas' };
    return { status: 'high', text: 'Kelembaban tinggi, terasa gerah' };
  };

  const getWindAnalysis = () => {
    const wind = weather.windSpeed;
    if (wind < 5) return { status: 'calm', text: 'Angin tenang, ideal untuk aktivitas air' };
    if (wind < 15) return { status: 'moderate', text: 'Angin sedang, kondisi normal' };
    if (wind < 25) return { status: 'strong', text: 'Angin kencang, hati-hati aktivitas outdoor' };
    return { status: 'very_strong', text: 'Angin sangat kencang, hindari aktivitas berisiko' };
  };

  const getPressureAnalysis = () => {
    const pressure = weather.pressure;
    if (pressure < 1000) return { status: 'low', text: 'Tekanan rendah, berpotensi cuaca buruk' };
    if (pressure < 1020) return { status: 'normal', text: 'Tekanan normal, cuaca stabil' };
    return { status: 'high', text: 'Tekanan tinggi, cuaca cerah' };
  };

  const tempAnalysis = getTemperatureAnalysis();
  const humidityAnalysis = getHumidityAnalysis();
  const windAnalysis = getWindAnalysis();
  const pressureAnalysis = getPressureAnalysis();

  const analysisData = [
    {
      title: 'Analisis Suhu',
      value: `${weather.temperature}°C`,
      analysis: tempAnalysis.text,
      icon: tempAnalysis.icon,
      color: tempAnalysis.color,
      trend: weather.temperature > 25 ? 'up' : 'down'
    },
    {
      title: 'Analisis Kelembaban',
      value: `${weather.humidity}%`,
      analysis: humidityAnalysis.text,
      icon: CheckCircle,
      color: humidityAnalysis.status === 'normal' ? 'green' : 'orange',
      trend: weather.humidity > 60 ? 'up' : 'down'
    },
    {
      title: 'Analisis Angin',
      value: `${weather.windSpeed} m/s`,
      analysis: windAnalysis.text,
      icon: weather.windSpeed > 15 ? AlertTriangle : CheckCircle,
      color: weather.windSpeed > 15 ? 'orange' : 'green',
      trend: weather.windSpeed > 10 ? 'up' : 'down'
    },
    {
      title: 'Analisis Tekanan',
      value: `${weather.pressure} hPa`,
      analysis: pressureAnalysis.text,
      icon: CheckCircle,
      color: 'blue',
      trend: weather.pressure > 1010 ? 'up' : 'down'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      case 'red': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Analisis Detail</span>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Premium
            </Badge>
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weather Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${getColorClasses(item.color)}/20`}>
                    <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${getColorClasses(item.color)} bg-clip-text text-transparent`}>
                      {item.value}
                    </span>
                    <div className="flex items-center space-x-1">
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.analysis}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator className="bg-white/20" />

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Rekomendasi</span>
            </h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-500/20 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Aktivitas Outdoor</p>
                    <p className="text-sm text-muted-foreground">
                      {weather.temperature > 30 ? 'Hindari aktivitas outdoor pada siang hari' : 'Kondisi baik untuk aktivitas outdoor'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-500/20 rounded-full">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Pakaian yang Disarankan</p>
                    <p className="text-sm text-muted-foreground">
                      {weather.temperature > 25 ? 'Pakaian ringan dan bernapas' : 'Pakaian hangat dan berlapis'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-500/20 rounded-full">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Kesehatan</p>
                    <p className="text-sm text-muted-foreground">
                      {weather.humidity > 70 ? 'Perbanyak minum air dan hindari dehidrasi' : 'Jaga kelembaban kulit'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Trend */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Tren Cuaca</span>
            </h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-center space-y-2">
                <div className="p-4 bg-white/10 rounded-full inline-block">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Grafik tren cuaca 24 jam akan ditampilkan di sini
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};