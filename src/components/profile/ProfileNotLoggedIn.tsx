
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const ProfileNotLoggedIn = () => (
  <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-2xl" />
      
      <motion.div 
        className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
        >
          <span className="text-3xl">🔐</span>
        </motion.div>
        
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Akses Terbatas
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Silakan login untuk melihat profil Anda dan mengakses semua fitur premium dengan pengalaman yang memukau
          </motion.p>
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default ProfileNotLoggedIn;
