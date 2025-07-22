
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import TutorialSection from "@/components/tutorial/TutorialSection";

const About = () => {
  const { theme } = useTheme();
  
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: (custom: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        delay: custom * 0.1 
      }
    })
  };
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.h1 
          variants={fadeUp}
          custom={0}
          initial="initial"
          animate="animate"
          className={cn(
            "text-3xl sm:text-4xl font-bold mb-6 text-center",
            theme === "light"
              ? "bg-gradient-to-r from-ocean-blue to-ocean-teal bg-clip-text text-transparent"
              : "bg-gradient-to-r from-visionfish-neon-purple to-visionfish-neon-blue bg-clip-text text-transparent"
          )}
        >
          Tentang VisionFish
        </motion.h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <motion.p 
            variants={fadeUp}
            custom={1}
            initial="initial"
            animate="animate" 
            className="mb-6 text-lg leading-relaxed"
          >
            VisionFish adalah platform inovatif yang dirancang untuk membantu nelayan, penjual ikan, dan konsumen dalam mengidentifikasi dan menganalisis kesegaran ikan menggunakan teknologi Artificial Intelligence.
          </motion.p>
          
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="initial"
            animate="animate"
            className={cn(
              "p-6 rounded-lg mb-8",
              theme === "light"
                ? "bg-gradient-to-br from-ocean-light/20 to-ocean-blue/10 border border-ocean-light/30"
                : "bg-gradient-to-br from-visionfish-neon-purple/20 to-visionfish-neon-blue/10 border border-visionfish-neon-blue/30 backdrop-blur-sm"
            )}
          >
            <h2 className={cn(
              "text-2xl font-semibold mb-4",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )}>
              Visi Kami
            </h2>
            <p className="mb-0">
              Menjadi platform terdepan dalam implementasi teknologi AI untuk sektor perikanan di Indonesia, mendorong praktik perikanan berkelanjutan dan meningkatkan kualitas hasil tangkapan ikan.
            </p>
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="initial"
            animate="animate"
          >
            <h2 className={cn(
              "text-2xl font-semibold mt-8 mb-4",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )}>
              Misi Kami
            </h2>
            <ul className={cn(
              "list-none pl-0 mb-6 space-y-3",
              theme === "light" ? "text-gray-700" : "text-gray-300"
            )}>
              {[
                "Menyediakan teknologi identifikasi spesies ikan yang akurat dan mudah digunakan",
                "Mengembangkan sistem analisis kesegaran ikan yang dapat diandalkan",
                "Memberikan informasi cuaca dan perkiraan kondisi memancing yang tepat",
                "Membangun komunitas nelayan dan penjual ikan yang terhubung secara digital",
                "Mendukung upaya konservasi dan pemanfaatan sumber daya laut berkelanjutan"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className={cn(
                    "inline-block h-6 w-6 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-white text-sm",
                    theme === "light" ? "bg-ocean-teal" : "bg-visionfish-neon-blue"
                  )}>
                    {index + 1}
                  </span>
                  <span className="mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="initial"
            animate="animate"
          >
            <h2 className={cn(
              "text-2xl font-semibold mt-8 mb-4",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )}>
              Tim Kami
            </h2>
            <p className="mb-4">
              Tim VisionFish terdiri dari para ahli di bidang teknologi AI, ilmu perikanan, pengembangan perangkat lunak, dan desain produk yang berdedikasi untuk menciptakan solusi inovatif bagi sektor perikanan.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeUp}
            custom={5}
            initial="initial"
            animate="animate"
            className={cn(
              "my-8 p-6 rounded-lg border",
              theme === "light" 
                ? "bg-blue-50 border-blue-100" 
                : "bg-blue-900/20 border-blue-800 backdrop-blur-sm"
            )}
          >
            <h3 className={cn(
              "text-xl font-semibold mb-3",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )}>
              Keunggulan Teknologi Kami
            </h3>
            <p className="mb-3">
              VisionFish menggunakan teknologi pengenalan gambar berbasis AI dengan akurasi tinggi untuk mengidentifikasi lebih dari 500 spesies ikan dan menilai tingkat kesegaran berdasarkan parameter visual.
            </p>
            <p className="mb-0">
              Sistem kami terus belajar dan meningkatkan akurasi melalui machine learning dan data yang dimasukkan oleh para pengguna platform.
            </p>
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="initial"
            animate="animate"
          >
            <h2 className={cn(
              "text-2xl font-semibold mt-8 mb-4",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )}>
              Bergabunglah dengan Kami
            </h2>
            <p className="mb-6">
              Kami mengundang Anda untuk mencoba VisionFish dan menjadi bagian dari komunitas yang peduli terhadap kualitas dan keberlanjutan sektor perikanan Indonesia.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeUp}
            custom={7}
            initial="initial"
            animate="animate"
            className="mt-12 text-center"
          >
            <p className={cn(
              "italic text-lg px-8 py-4 rounded-lg mx-auto max-w-2xl",
              theme === "light" 
                ? "bg-gradient-to-r from-ocean-light/10 to-ocean-blue/10 border border-ocean-light/20"
                : "bg-gradient-to-r from-visionfish-neon-purple/10 to-visionfish-neon-blue/10 border border-visionfish-neon-blue/20"
            )}>
              "Menangkap lebih cerdas, menjual lebih baik, dan konsumsi lebih sehat dengan VisionFish"
            </p>
          </motion.div>
        </div>

        {/* Tutorial Section */}
        <TutorialSection />
      </motion.div>
    </Layout>
  );
};

export default About;
