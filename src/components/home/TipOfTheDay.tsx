import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RotateCcw, Reply } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
interface TipOfTheDayProps {
  tips: string[];
}

// Extended tips collection with practical fishing and fish quality tips
const EXTENDED_TIPS = [
// Original tips (if any passed)
// Fishing technique tips
"Waktu terbaik memancing adalah saat pagi (05:00-08:00) dan sore (16:00-18:00) ketika ikan aktif mencari makan.", "Gunakan umpan alami seperti cacing tanah, udang kecil, atau kroto untuk hasil maksimal.", "Perhatikan arah angin - memancing dengan arah angin akan memberikan jangkauan lebih jauh.", "Jaga ketenangan saat memancing, hindari suara keras yang dapat mengusir ikan.",
// Fish freshness tips
"Ikan segar memiliki mata jernih dan menonjol, hindari ikan dengan mata keruh atau cekung.", "Insang ikan segar berwarna merah cerah, jika pucat atau coklat berarti sudah tidak fresh.", "Tekan daging ikan dengan jari, jika kembali ke bentuk semula dengan cepat berarti masih segar.", "Ikan segar tidak berbau amis menyengat, hanya berbau laut yang segar.", "Sisik ikan segar mengkilap dan menempel kuat, mudah lepas jika sudah tidak fresh.",
// Storage and handling tips
"Simpan ikan dalam es atau freezer segera setelah ditangkap untuk menjaga kesegaran.", "Bersihkan ikan dengan air bersih dan keringkan sebelum disimpan.", "Gunakan wadah kedap udara untuk menyimpan ikan di kulkas maksimal 2-3 hari.", "Bekukan ikan jika akan disimpan lebih dari 3 hari, tahan hingga 3-6 bulan.", "Cairkan ikan beku secara perlahan di kulkas, jangan pada suhu ruang.",
// Cooking and preparation tips
"Cuci tangan dengan sabun sebelum dan sesudah menangani ikan mentah.", "Gunakan talenan terpisah untuk ikan mentah agar tidak kontaminasi silang.", "Masak ikan hingga suhu internal 63°C untuk membunuh bakteri berbahaya.", "Ikan yang sudah dimasak sebaiknya dikonsumsi dalam 2 jam jika dibiarkan suhu ruang.", "Simpan ikan masak di kulkas maksimal 3-4 hari dalam wadah tertutup.",
// Nutritional and health tips
"Ikan kaya omega-3 yang baik untuk kesehatan jantung dan otak, konsumsi 2-3x seminggu.", "Ikan berlemak seperti salmon, makarel, dan sarden memiliki kandungan omega-3 tertinggi.", "Hindari ikan mentah jika sistem imun sedang lemah atau sedang hamil.", "Pilih ikan lokal untuk mendapatkan kesegaran terbaik dan mendukung nelayan setempat.", "Ikan air tawar seperti nila dan lele adalah sumber protein murah yang bergizi tinggi.",
// Environmental and sustainability tips
"Pilih ikan dari budidaya berkelanjutan untuk menjaga kelestarian lingkungan.", "Hindari membeli ikan yang masih kecil agar populasi tetap terjaga.", "Dukung nelayan lokal dengan membeli ikan langsung dari pasar tradisional.", "Manfaatkan seluruh bagian ikan - kepala untuk kaldu, tulang untuk pakan ternak.", "Buang limbah ikan pada tempat yang tepat agar tidak mencemari lingkungan.",
// Practical daily tips
"Beli ikan di pagi hari saat stok masih fresh dari nelayan.", "Bawa cool box atau kantong pendingin saat berbelanja ikan.", "Perhatikan label tanggal pada ikan kemasan untuk memastikan kesegaran.", "Pelajari ciri-ciri ikan segar sesuai jenisnya - setiap ikan punya karakteristik berbeda.", "Jangan ragu bertanya pada penjual tentang asal dan waktu tangkap ikan.",
// Technology and modern tips
"Gunakan aplikasi VisionFish untuk menganalisis kualitas ikan dengan teknologi AI.", "Foto ikan sebelum membeli untuk dokumentasi dan analisis kualitas.", "Manfaatkan fitur identifikasi spesies untuk mengenal jenis ikan yang tidak familiar.", "Simpan history analisis untuk tracking kualitas ikan dari supplier berbeda.", "Bagikan tips dan pengalaman di komunitas untuk saling belajar.",
// Seasonal and weather tips
"Musim hujan adalah waktu yang baik untuk memancing ikan air tawar.", "Cuaca mendung sering memberikan hasil tangkapan yang lebih baik.", "Hindari membeli ikan laut saat cuaca buruk karena biasanya stok lama.", "Ikan air payau seperti bandeng lebih aktif saat air surut.", "Perhatikan siklus bulan - banyak nelayan percaya full moon memberikan hasil terbaik."];
const TipOfTheDay = ({
  tips
}: TipOfTheDayProps) => {
  const [allTips] = useState(() => {
    // Combine passed tips with extended tips, remove duplicates
    const combinedTips = [...(tips || []), ...EXTENDED_TIPS];
    return [...new Set(combinedTips)]; // Remove duplicates
  });
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const {
    theme
  } = useTheme();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % allTips.length);
    }, 12000); // Increased to 12 seconds for longer reading time

    return () => clearInterval(interval);
  }, [allTips.length]);
  const nextTip = () => {
    setCurrentTipIndex(prev => (prev + 1) % allTips.length);
  };
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * allTips.length);
    setCurrentTipIndex(randomIndex);
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.7,
    duration: 0.6
  }}>
      <Card className={cn("p-4 md:p-5 transition-all duration-300 hover:shadow-lg", theme === 'light' ? 'bg-gradient-to-br from-slate-50 to-purple-50/30 border-slate-200/60 hover:border-slate-300/80' : 'bg-gradient-to-br from-gray-800/50 to-purple-900/20 border-gray-700/50')}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-full", theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/50 text-purple-400')}>
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className={cn("text-sm font-medium", theme === 'light' ? 'text-slate-700' : 'text-white')}>
              Tips Hari Ini
            </h3>
            <span className={cn("text-xs px-2 py-1 rounded-full", theme === 'light' ? 'bg-purple-50 text-purple-600' : 'bg-purple-900/30 text-purple-300')}>
              {allTips.length} tips tersedia
            </span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={getRandomTip} className={cn("h-8 w-8 p-0 transition-all duration-200", theme === 'light' ? 'hover:bg-blue-100 text-blue-600' : 'hover:bg-blue-900/50 text-blue-400')} title="Tip acak">
              <Reply className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextTip} className={cn("h-8 w-8 p-0 transition-all duration-200", theme === 'light' ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-gray-700 text-gray-300')} title="Tip selanjutnya">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="relative min-h-[80px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p key={currentTipIndex} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} transition={{
            duration: 0.3
          }} className={cn("text-sm leading-relaxed", theme === 'light' ? 'text-slate-700' : 'text-gray-200')}>
              💡 {allTips[currentTipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex justify-center gap-1 flex-1">
            {allTips.slice(0, Math.min(5, allTips.length)).map((_, index) => <button key={index} onClick={() => setCurrentTipIndex(index)} className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", index === currentTipIndex % 5 ? theme === 'light' ? 'bg-purple-500 w-4' : 'bg-purple-400 w-4' : theme === 'light' ? 'bg-slate-300 hover:bg-slate-400' : 'bg-gray-600 hover:bg-gray-500')} />)}
          </div>
          
        </div>
      </Card>
    </motion.div>;
};
export default TipOfTheDay;