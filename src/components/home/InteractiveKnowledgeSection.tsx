
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Book, Fish, Anchor, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import HorizontalScrollSection from "./HorizontalScrollSection";
import AnimatedKnowledgeCard from "./AnimatedKnowledgeCard";

// Define fishery topics data
const fisheryTopics = [
  {
    id: "technology",
    title: "Teknologi Perikanan",
    icon: <Book className="h-5 w-5" />,
    content: [
      {
        title: "Teknik Penanganan",
        description: "Penanganan ikan segar harus dimulai segera setelah ikan ditangkap dengan menyimpan dalam wadah berisi es atau air dingin. Hal ini mencegah perkembangbiakan bakteri dan menjaga kesegaran ikan."
      },
      {
        title: "Sistem Rantai Dingin",
        description: "Sistem rantai dingin adalah proses penyimpanan dan transportasi ikan pada suhu rendah konsisten (0-4°C) dari lokasi penangkapan hingga konsumen, untuk mempertahankan kualitas dan kesegaran."
      },
      {
        title: "Teknik Preservasi Modern",
        description: "Teknik preservasi modern meliputi modified atmosphere packaging (MAP), high-pressure processing (HPP), dan iradiasi yang dapat memperpanjang umur simpan ikan tanpa mempengaruhi nutrisi dan rasa."
      },
      {
        title: "Teknologi Pascapanen",
        description: "Teknologi pascapanen perikanan meliputi pengolahan secara fisik (pengeringan, pengasapan), kimiawi (penggaraman, pengasinan), dan biologis (fermentasi) untuk diversifikasi produk perikanan."
      },
      {
        title: "Sustainable Fishing Technology",
        description: "Teknologi penangkapan ikan berkelanjutan menggunakan alat penangkap ikan selektif yang meminimalkan tangkapan sampingan dan kerusakan lingkungan, seperti line fishing dan trap nets."
      }
    ]
  },
  {
    id: "species",
    title: "Jenis Ikan Komersial",
    icon: <Fish className="h-5 w-5" />,
    content: [
      {
        title: "Tuna (Thunnus sp.)",
        description: "Ikan tuna memiliki daging merah yang kaya omega-3 dan protein. Ciri ikan tuna segar adalah mata jernih, insang merah cerah, dan daging elastis. Tuna digunakan untuk sashimi, steak, dan pengalengan."
      },
      {
        title: "Kerapu (Epinephelus sp.)",
        description: "Kerapu adalah ikan karang bernilai ekonomi tinggi. Ikan segar memiliki warna cerah, sisik mengkilap, dan mata jernih. Kerapu dibudidayakan dalam keramba jaring apung (KJA) dan populer untuk steam fish dan sup."
      },
      {
        title: "Kakap (Lutjanus sp.)",
        description: "Kakap merupakan ikan demersal yang hidup di dasar perairan. Karakteristik ikan kakap segar adalah daging putih kenyal, mata jernih, dan permukaan tubuh mengkilap. Populer untuk dibakar dan digoreng."
      },
      {
        title: "Bandeng (Chanos chanos)",
        description: "Ikan bandeng adalah ikan budidaya air payau dengan nilai gizi tinggi. Ciri kesegaran bandeng adalah sisik utuh mengkilap, perut tidak sobek, dan daging elastis. Diolah menjadi bandeng presto dan bandeng asap."
      },
      {
        title: "Nila (Oreochromis niloticus)",
        description: "Nila adalah ikan air tawar yang mudah dibudidayakan dengan pertumbuhan cepat. Ikan nila segar memiliki sisik utuh, mata jernih, dan insang merah. Ideal untuk digoreng, dibakar, dan dipepes."
      }
    ]
  },
  {
    id: "equipment",
    title: "Peralatan dan Teknik",
    icon: <Anchor className="h-5 w-5" />,
    content: [
      {
        title: "Jaring Insang (Gillnet)",
        description: "Jaring berbentuk persegi panjang yang dipasang tegak lurus di dalam air. Prinsip kerjanya adalah menangkap ikan yang tersangkut pada bagian insang ketika mencoba berenang melewati jaring."
      },
      {
        title: "Purse Seine",
        description: "Alat tangkap ikan pelagis seperti cakalang dan tongkol yang berbentuk jaring kantong besar. Pengoperasiannya dengan mengelilingi gerombolan ikan kemudian menarik tali kerut di bagian bawah."
      },
      {
        title: "Pancing Rawai (Longline)",
        description: "Terdiri dari tali utama dengan sejumlah tali cabang yang masing-masing diberi mata pancing. Efektif untuk menangkap ikan pelagis besar seperti tuna dan marlin dengan dampak lingkungan minimal."
      },
      {
        title: "Bubu (Fish Trap)",
        description: "Alat tangkap pasif berbentuk kurungan dengan pintu yang memungkinkan ikan masuk tetapi sulit keluar. Ramah lingkungan dan cocok untuk menangkap ikan karang dan kepiting."
      },
      {
        title: "Teknik Preservasi di Kapal",
        description: "Metode penyimpanan ikan di kapal termasuk penggunaan es batu (icing), refrigerated seawater (RSW), dan pembekuan cepat untuk menjaga kesegaran ikan hingga pelabuhan."
      }
    ]
  },
  {
    id: "education",
    title: "Pendidikan Perikanan",
    icon: <GraduationCap className="h-5 w-5" />,
    content: [
      {
        title: "Program Studi Perikanan",
        description: "Pendidikan formal perikanan tersedia dari tingkat diploma hingga doktoral dengan fokus pada teknologi penangkapan, budidaya, pengolahan, dan manajemen sumber daya perikanan."
      },
      {
        title: "Sertifikasi Kompetensi",
        description: "Sertifikasi BNSP (Badan Nasional Sertifikasi Profesi) untuk tenaga kerja perikanan termasuk penangkapan ikan, budidaya, dan pengolahan hasil perikanan untuk standardisasi keterampilan."
      },
      {
        title: "Pelatihan Berbasis Komunitas",
        description: "Program pelatihan untuk nelayan dan pembudidaya ikan skala kecil yang mencakup teknik penangkapan ramah lingkungan, budidaya berkelanjutan, dan pengolahan pasca panen."
      },
      {
        title: "Penyuluhan Perikanan",
        description: "Layanan penyuluhan dari lembaga pemerintah dan LSM untuk transfer teknologi dan pengetahuan terbaru ke pelaku usaha perikanan di lapangan."
      },
      {
        title: "Riset dan Pengembangan",
        description: "Institusi pendidikan dan lembaga riset perikanan mengembangkan teknologi dan metode baru untuk meningkatkan produktivitas dan keberlanjutan sektor perikanan."
      }
    ]
  }
];

const InteractiveKnowledgeSection = () => {
  const [activeTopicId, setActiveTopicId] = useState("technology");
  const [activeContentIndices, setActiveContentIndices] = useState<Record<string, number>>({
    technology: 0,
    species: 0,
    equipment: 0,
    education: 0
  });
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Auto rotation for content within active topic
  useEffect(() => {
    const activeTopic = fisheryTopics.find(topic => topic.id === activeTopicId);
    if (!activeTopic) return;
    
    const interval = setInterval(() => {
      setActiveContentIndices(prev => ({
        ...prev,
        [activeTopicId]: (prev[activeTopicId] + 1) % activeTopic.content.length
      }));
    }, 7000); // Rotate content every 7 seconds
    
    return () => clearInterval(interval);
  }, [activeTopicId]);

  return (
    <div ref={sectionRef} className="mb-16">
      <motion.h2 
        className={cn(
          "text-2xl md:text-3xl font-bold mb-6 text-center",
          theme === "light" ? "text-gray-900" : "text-white"
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        Pengetahuan Perikanan
      </motion.h2>
      
      {isMobile ? (
        // Mobile view - horizontal scrollable cards
        <HorizontalScrollSection 
          title="" 
          showControls={false} 
          itemWidth={85}
        >
          {fisheryTopics.map((topic) => (
            <AnimatedKnowledgeCard
              key={topic.id}
              topic={topic}
              isActive={activeTopicId === topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              activeContent={activeContentIndices[topic.id]}
              onContentChange={(index) => {
                setActiveContentIndices(prev => ({
                  ...prev,
                  [topic.id]: index
                }));
              }}
              autoRotate={activeTopicId === topic.id}
            />
          ))}
        </HorizontalScrollSection>
      ) : (
        // Desktop view - grid layout with active card expanded
        <div className="grid grid-cols-2 gap-6">
          {fisheryTopics.map((topic) => (
            <AnimatedKnowledgeCard
              key={topic.id}
              topic={topic}
              isActive={activeTopicId === topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              activeContent={activeContentIndices[topic.id]}
              onContentChange={(index) => {
                setActiveContentIndices(prev => ({
                  ...prev,
                  [topic.id]: index
                }));
              }}
              autoRotate={activeTopicId === topic.id}
            />
          ))}
        </div>
      )}
      
      {/* Visual indicator for scroll or interaction */}
      <motion.div
        className="mt-6 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className={cn(
          "text-sm text-muted-foreground flex items-center gap-2",
          "opacity-60"
        )}>
          {isMobile ? (
            <span>Geser untuk melihat lebih banyak topik</span>
          ) : (
            <span>Klik kartu untuk melihat lebih detail</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveKnowledgeSection;
