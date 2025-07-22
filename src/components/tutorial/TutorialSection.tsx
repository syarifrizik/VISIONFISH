import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Fish, 
  Cloud, 
  Users, 
  Camera,
  ArrowRight,
  Sparkles,
  Target,
  Waves,
  Eye,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TutorialModal from './TutorialModal';

interface TutorialFeature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  gradient: string;
  steps: string[];
  tips: string[];
}

const TutorialSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TutorialFeature | null>(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features: TutorialFeature[] = [
    {
      id: 'fish-analysis',
      icon: Fish,
      title: 'Analisis Ikan',
      description: 'Pelajari cara menganalisis kesegaran ikan dengan AI',
      color: 'from-cyan-400 to-blue-500',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      steps: [
        'Buka menu Analisis Ikan',
        'Ambil foto ikan dengan kualitas baik',
        'Tunggu AI memproses gambar',
        'Lihat hasil analisis kesegaran',
        'Simpan hasil untuk referensi'
      ],
      tips: [
        'Gunakan pencahayaan yang cukup',
        'Pastikan ikan terlihat jelas',
        'Hindari bayangan pada foto'
      ]
    },
    {
      id: 'species-id',
      icon: Eye,
      title: 'Identifikasi Spesies',
      description: 'Mengenali jenis ikan dengan teknologi AI',
      color: 'from-green-400 to-emerald-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
      steps: [
        'Pilih fitur Identifikasi Spesies',
        'Upload foto ikan yang ingin diidentifikasi',
        'AI akan menganalisis karakteristik ikan',
        'Dapatkan informasi spesies lengkap',
        'Pelajari habitat dan karakteristik'
      ],
      tips: [
        'Foto seluruh tubuh ikan untuk akurasi maksimal',
        'Pastikan sirip dan ekor terlihat jelas',
        'Gunakan background kontras'
      ]
    },
    {
      id: 'weather',
      icon: Cloud,
      title: 'Cuaca & Prediksi',
      description: 'Manfaatkan data cuaca untuk aktivitas memancing',
      color: 'from-purple-400 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20',
      steps: [
        'Akses menu Cuaca',
        'Pilih lokasi memancing',
        'Lihat kondisi cuaca real-time',
        'Cek prediksi untuk hari berikutnya',
        'Gunakan rekomendasi waktu optimal'
      ],
      tips: [
        'Periksa cuaca sebelum berangkat',
        'Perhatikan arah dan kecepatan angin',
        'Gunakan data pasang surut'
      ]
    },
    {
      id: 'community',
      icon: Users,
      title: 'Komunitas',
      description: 'Bergabung dengan komunitas nelayan dan penggemar ikan',
      color: 'from-orange-400 to-red-500',
      gradient: 'from-orange-500/20 to-red-500/20',
      steps: [
        'Buat profil lengkap',
        'Ikuti pengguna lain',
        'Bagikan hasil tangkapan',
        'Ikut diskusi di forum',
        'Bertukar tips dan pengalaman'
      ],
      tips: [
        'Lengkapi profil untuk kredibilitas',
        'Bagikan konten berkualitas',
        'Aktif berinteraksi dengan komunitas'
      ]
    }
  ];

  const handleFeatureClick = (feature: TutorialFeature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section ref={ref} className="py-16 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-visionfish-neon-blue/20 to-visionfish-neon-purple/20 rounded-full border border-white/20 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-visionfish-neon-blue" />
            <span className="text-sm font-medium text-white">Cara Menggunakan</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-visionfish-neon-blue via-visionfish-neon-purple to-visionfish-neon-pink bg-clip-text text-transparent">
            Cara Menggunakan VisionFish
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Pelajari semua fitur VisionFish dengan panduan interaktif yang mudah diikuti. 
            Dari analisis ikan hingga bergabung dengan komunitas nelayan digital.
          </p>

          {/* Quick Start Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="group bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-purple hover:from-visionfish-neon-purple hover:to-visionfish-neon-pink text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Tur Cepat (3 menit)
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-2xl transition-all duration-300"
            >
              <a 
                href="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=VisionFish.drawio&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1WVfNs5BBU45WfrxrWhQPXJx0yNI1w0uC%26export%3Ddownload"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Panduan Lengkap
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick(feature)}
            >
              <Card className="h-full p-6 bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden relative">
                {/* Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-visionfish-neon-blue transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 mb-4">
                    {feature.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>{feature.steps.length} langkah mudah</span>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-visionfish-neon-blue via-visionfish-neon-purple to-visionfish-neon-pink p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-full w-full rounded-lg bg-gray-900" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Tips */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-br from-visionfish-neon-blue/10 via-visionfish-neon-purple/10 to-visionfish-neon-pink/10 border border-white/10 backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Tips Sukses</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3 border border-cyan-400/30">
                  <Camera className="w-8 h-8 text-cyan-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Foto Berkualitas</h4>
                <p className="text-sm text-gray-300">Gunakan pencahayaan yang baik dan fokus yang tajam untuk hasil analisis optimal</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-3 border border-green-400/30">
                  <Waves className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Konsistensi</h4>
                <p className="text-sm text-gray-300">Gunakan VisionFish secara rutin untuk mendapatkan pengalaman terbaik</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3 border border-purple-400/30">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Komunitas</h4>
                <p className="text-sm text-gray-300">Aktif berinteraksi dengan komunitas untuk berbagi pengalaman</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feature={selectedFeature}
      />
    </section>
  );
};

export default TutorialSection;