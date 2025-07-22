
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Camera, Sun, Focus, Target, CheckCircle } from 'lucide-react';

const TipsSection = () => {
  const tips = [
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Kualitas Foto",
      description: "Gunakan resolusi tinggi (minimal 1080p) untuk detail yang jelas",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      icon: <Sun className="h-5 w-5" />,
      title: "Pencahayaan",
      description: "Pastikan pencahayaan alami atau lampu putih yang cukup terang",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    },
    {
      icon: <Focus className="h-5 w-5" />,
      title: "Fokus Bagian Penting",
      description: "Fokuskan pada mata, insang, dan permukaan kulit ikan",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Sudut Pengambilan",
      description: "Ambil foto dari samping dan dekat untuk detail maksimal",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    }
  ];

  const analysisTypeTips = {
    species: [
      "Ambil foto keseluruhan ikan dari samping",
      "Pastikan sirip dan ekor terlihat jelas",
      "Hindari foto terlalu dekat yang memotong bagian ikan"
    ],
    freshness: [
      "Fokus pada mata, insang, dan permukaan kulit",
      "Pastikan mata ikan terlihat jelas (jernih/keruh)",
      "Ambil foto insang dalam kondisi terbuka jika memungkinkan"
    ],
    both: [
      "Ambil foto dari berbagai sudut (samping, depan, detail)",
      "Pastikan seluruh ikan dan detail penting terlihat",
      "Gunakan background kontras untuk hasil optimal"
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-2 border-visionfish-neon-blue/30 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
            <Lightbulb className="h-6 w-6 text-visionfish-neon-blue" />
            Tips untuk Hasil Terbaik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* General Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/20"
              >
                <div className={`p-2 rounded-full ${tip.color}`}>
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Analysis Type Specific Tips */}
          <div className="space-y-4 pt-4 border-t border-white/20">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Tips Khusus Berdasarkan Jenis Analisis
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analysisTypeTips).map(([type, tipsList]) => (
                <div key={type} className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {type === 'species' ? '🐟 Identifikasi Spesies' : 
                     type === 'freshness' ? '✨ Analisis Kesegaran' : 
                     '⚡ Analisis Lengkap'}
                  </Badge>
                  <ul className="space-y-1">
                    {tipsList.map((tip, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 text-xs">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quality Checklist */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200/50">
            <h4 className="font-semibold text-sm mb-3 text-green-800 dark:text-green-300">
              ✅ Checklist Kualitas Foto
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                <span>Pencahayaan cukup terang</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                <span>Foto tidak buram/blur</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                <span>Ikan terlihat jelas</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                <span>Background kontras</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TipsSection;
