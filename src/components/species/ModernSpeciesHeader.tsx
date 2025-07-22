
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Fish, Bot } from 'lucide-react';

interface ModernSpeciesHeaderProps {
  title?: string;
  subtitle?: string;
}

const ModernSpeciesHeader = ({ 
  title = "Identifikasi Spesies Ikan", 
  subtitle = "Teknologi VisionFish berbasis Ai terdepan untuk analisis spesies dan kesegaran ikan dengan akurasi tinggi" 
}: ModernSpeciesHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-visionfish-neon-blue/10 via-transparent to-visionfish-neon-pink/10 rounded-3xl blur-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <motion.div 
        className="relative z-10 text-center space-y-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Modern Gradient Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent leading-tight block">
              {title}
            </span>
          </h1>
          
          {/* Floating Icons */}
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
            className="absolute -top-2 -right-8 text-blue-500/70"
          >
            <Fish className="w-8 h-8" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, -15, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-1 -left-6 text-purple-500/70"
          >
            <Bot className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* Enhanced Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        {/* Glassmorphism Feature Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { label: "AI Vision", icon: "🤖" },
            { label: "Real-time Analysis", icon: "⚡" },
            { label: "Akurasi Tinggi", icon: "🎯" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium shadow-lg hover:bg-white/15 transition-all duration-300"
            >
              <span className="mr-2">{feature.icon}</span>
              {feature.label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernSpeciesHeader;
