
import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCategory {
  range: string;
  label: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  description: string;
  recommendations: string[];
}

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  currentCategory: string;
}

export const ScoreExplanationModal = ({
  isOpen,
  onClose,
  currentScore,
  currentCategory
}: ScoreExplanationModalProps) => {
  const scoreCategories: ScoreCategory[] = [
    {
      range: "8.5 - 10.0",
      label: "Excellent",
      color: "text-green-600 bg-green-100 border-green-200",
      textColor: "text-green-600",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      description: "Kondisi optimal untuk semua jenis aktivitas perikanan",
      recommendations: [
        "Waktu terbaik untuk memancing atau operasi penangkapan",
        "Semua teknik penangkapan dapat diterapkan",
        "Kondisi ideal untuk penelitian lapangan",
        "Manfaatkan window time ini secara maksimal"
      ]
    },
    {
      range: "7.0 - 8.4",
      label: "Very Good", 
      color: "text-blue-600 bg-blue-100 border-blue-200",
      textColor: "text-blue-600",
      icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
      description: "Kondisi sangat baik dengan sedikit penyesuaian strategi",
      recommendations: [
        "Pilih teknik yang sesuai dengan kondisi dominan",
        "Monitor perubahan parameter secara berkala",
        "Fokus pada species target yang responsif",
        "Siapkan backup plan jika kondisi berubah"
      ]
    },
    {
      range: "5.5 - 6.9",
      label: "Good",
      color: "text-yellow-600 bg-yellow-100 border-yellow-200",
      textColor: "text-yellow-600",
      icon: <Info className="w-4 h-4 text-yellow-600" />,
      description: "Kondisi cukup baik namun memerlukan strategi khusus",
      recommendations: [
        "Gunakan teknik adaptif sesuai kondisi",
        "Fokus pada parameter yang performing baik",
        "Pertimbangkan timing dan lokasi alternatif",
        "Patience dan skill menjadi kunci sukses"
      ]
    },
    {
      range: "4.0 - 5.4",
      label: "Fair",
      color: "text-orange-600 bg-orange-100 border-orange-200",
      textColor: "text-orange-600",
      icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      description: "Kondisi cukup menantang, butuh pengalaman dan adaptasi",
      recommendations: [
        "Gunakan hanya teknik yang sudah dikuasai",
        "Fokus pada safety dan risk management", 
        "Pertimbangkan menunda aktivitas non-urgent",
        "Monitor forecast untuk window yang lebih baik"
      ]
    },
    {
      range: "0.0 - 3.9",
      label: "Poor",
      color: "text-red-600 bg-red-100 border-red-200",
      textColor: "text-red-600",
      icon: <XCircle className="w-4 h-4 text-red-600" />,
      description: "Kondisi tidak ideal, prioritaskan keselamatan",
      recommendations: [
        "Hindari aktivitas berisiko tinggi",
        "Tunggu perbaikan kondisi cuaca",
        "Fokus pada planning dan persiapan",
        "Gunakan waktu untuk maintenance equipment"
      ]
    }
  ];

  const getCurrentCategoryData = () => {
    return scoreCategories.find(cat => cat.label === currentCategory) || scoreCategories[2];
  };

  const currentCategoryData = getCurrentCategoryData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Penjelasan Sistem Penilaian Kondisi Perikanan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Score Highlight */}
          <div className={cn(
            "p-4 rounded-xl border-2",
            currentCategoryData.color
          )}>
            <div className="flex items-center gap-3 mb-3">
              {currentCategoryData.icon}
              <div>
                <h3 className="font-semibold text-lg">
                  Skor Anda: {currentScore} ({currentCategory})
                </h3>
                <p className="text-sm opacity-80">
                  Rentang {currentCategoryData.range}
                </p>
              </div>
            </div>
            <p className="text-sm mb-3">{currentCategoryData.description}</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">Rekomendasi untuk kondisi ini:</p>
              <ul className="text-xs space-y-1 ml-4">
                {currentCategoryData.recommendations.map((rec, index) => (
                  <li key={index} className="list-disc">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* All Categories Reference */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Referensi Lengkap Kategori Skor:
            </h4>
            
            <div className="grid gap-3">
              {scoreCategories.map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border",
                    category.color,
                    category.label === currentCategory ? "ring-2 ring-blue-500" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    {category.icon}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className={cn("font-medium", category.textColor)}>{category.label}</h5>
                        <Badge variant="outline" className="text-xs">
                          {category.range}
                        </Badge>
                      </div>
                      <p className={cn("text-sm mb-2", category.textColor)}>{category.description}</p>
                      <div className="space-y-1">
                        <p className={cn("text-xs font-medium", category.textColor)}>Strategi:</p>
                        <ul className={cn("text-xs space-y-0.5 ml-4", category.textColor)}>
                          {category.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="list-disc">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Methodology Explanation */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Metodologi Perhitungan:
            </h5>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Sistem penilaian ini menggunakan <strong>weighted scoring algorithm</strong> yang menggabungkan 6 parameter cuaca utama:
              </p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• <strong>Suhu (20%)</strong> - Berdasarkan rentang optimal 28-30°C untuk ikan tropis</li>
                <li>• <strong>Tekanan Udara (25%)</strong> - Stabilitas 1013-1020 hPa untuk aktivitas ikan normal</li>
                <li>• <strong>Kecepatan Angin (20%)</strong> - Rentang 5-15 km/h untuk kondisi operasional optimal</li>
                <li>• <strong>Kelembaban (10%)</strong> - Tingkat 60-80% untuk kenyamanan operasional</li>
                <li>• <strong>Waktu (15%)</strong> - Peak hours berdasarkan feeding pattern ikan</li>
                <li>• <strong>Stabilitas Cuaca (10%)</strong> - Konsistensi kondisi untuk prediktabilitas</li>
              </ul>
              <p className="text-xs mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <strong>Catatan:</strong> Bobot parameter telah dikalibrasi berdasarkan penelitian perikanan tropis Indonesia dan dapat beradaptasi dengan kondisi lokal.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
