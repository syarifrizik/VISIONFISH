
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, TrendingUp, ShoppingCart, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Role {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  benefits: string[];
  context: string;
}

const roles: Role[] = [
  {
    id: 'penyuluh',
    name: 'Penyuluh',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-blue-500',
    description: 'Membantu petani dan nelayan meningkatkan kualitas ikan',
    benefits: [
      'Panduan standar SNI untuk edukasi',
      'Tools analisis cepat untuk lapangan',
      'Dokumentasi hasil untuk pelaporan'
    ],
    context: 'Sebagai penyuluh, Anda dapat menggunakan tools ini untuk memberikan panduan praktis kepada petani dan nelayan tentang standar kualitas ikan sesuai SNI.'
  },
  {
    id: 'peneliti',
    name: 'Peneliti',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-purple-500',
    description: 'Melakukan penelitian kualitas dan keamanan pangan ikan',
    benefits: [
      'Analisis batch untuk dataset besar',
      'Export data untuk penelitian lanjutan',
      'Visualisasi data komprehensif'
    ],
    context: 'Untuk penelitian, tools ini menyediakan analisis sistematis berdasarkan parameter SNI dengan kemampuan export data untuk analisis statistik lanjutan.'
  },
  {
    id: 'pedagang',
    name: 'Pedagang',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-green-500',
    description: 'Memastikan kualitas ikan untuk bisnis yang menguntungkan',
    benefits: [
      'Verifikasi kualitas sebelum pembelian',
      'Standar penilaian yang konsisten',
      'Dokumentasi untuk sertifikasi'
    ],
    context: 'Sebagai pedagang, Anda dapat memverifikasi kualitas ikan secara objektif untuk memastikan produk yang dijual memenuhi standar dan memuaskan pelanggan.'
  },
  {
    id: 'konsumen',
    name: 'Konsumen',
    icon: <ShoppingCart className="w-5 h-5" />,
    color: 'bg-orange-500',
    description: 'Memilih ikan segar berkualitas untuk keluarga',
    benefits: [
      'Panduan memilih ikan segar',
      'Pemahaman standar kualitas',
      'Edukasi keamanan pangan'
    ],
    context: 'Sebagai konsumen, pelajari cara menilai kesegaran ikan menggunakan parameter visual yang mudah dipahami untuk memastikan ikan yang Anda beli berkualitas baik.'
  }
];

const RoleBasedHero: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentRole = roles[currentRoleIndex];

  return (
    <div className="space-y-6">
      {/* Running Text Hero */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-2xl sm:text-3xl font-bold">
          <span className="text-gray-700 dark:text-gray-300">Apakah Anda seorang</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className={`p-2 rounded-full ${currentRole.color} text-white`}>
                {currentRole.icon}
              </div>
              <span className="text-visionfish-neon-blue font-bold">
                {currentRole.name}?
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={currentRole.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg"
          >
            {currentRole.description}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole?.id === role.id
                  ? 'ring-2 ring-visionfish-neon-blue shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className={`w-10 h-10 rounded-full ${role.color} text-white flex items-center justify-center mx-auto`}>
                  {role.icon}
                </div>
                <div className="text-sm font-medium">{role.name}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contextual Information */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-visionfish-neon-blue/30 bg-gradient-to-br from-visionfish-neon-blue/5 to-transparent">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedRole.color} text-white`}>
                    {selectedRole.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Untuk {selectedRole.name}</h3>
                    <p className="text-muted-foreground text-sm">{selectedRole.description}</p>
                  </div>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200/50">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 text-visionfish-neon-blue mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedRole.context}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Manfaat untuk Anda:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.benefits.map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-white/70 dark:bg-gray-800/70"
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleBasedHero;
