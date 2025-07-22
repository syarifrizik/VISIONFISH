
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Book, Fish, Anchor, GraduationCap, ChevronRight, ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the type for the Fishery Knowledge content
interface FisheryTopicContent {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
  }[];
}

const fisheryTopics: FisheryTopicContent[] = [
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

export default function FisheryKnowledgeSection() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("technology");
  const [contentIndex, setContentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const isMobile = useIsMobile();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto rotation for content
  useEffect(() => {
    const activeTopic = fisheryTopics.find(topic => topic.id === activeTab);
    if (!activeTopic) return;
    
    const contentLength = activeTopic.content.length;
    const interval = setInterval(() => {
      setContentIndex((prev) => (prev + 1) % contentLength);
    }, 7000); // Change content every 7 seconds
    
    return () => clearInterval(interval);
  }, [activeTab]);
  
  // Get the current active topic
  const activeTopic = fisheryTopics.find(topic => topic.id === activeTab) || fisheryTopics[0];
  const activeContent = activeTopic.content[contentIndex];
  
  // Handle tab scroll on mobile
  useEffect(() => {
    if (!tabsContainerRef.current || !isMobile) return;
    
    const activeTabElement = document.getElementById(`tab-${activeTab}`);
    if (!activeTabElement) return;
    
    const container = tabsContainerRef.current;
    const tabPosition = activeTabElement.offsetLeft;
    const tabWidth = activeTabElement.offsetWidth;
    const containerWidth = container.offsetWidth;
    
    // Scroll to center the active tab
    container.scrollLeft = tabPosition - (containerWidth / 2) + (tabWidth / 2);
  }, [activeTab, isMobile]);
  
  // Handle swipe for content
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    let currentX: number;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const difference = startX - currentX;
    // Detect significant movement (for swipe)
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        // Swipe left - next content
        goToNextContent();
      } else {
        // Swipe right - previous content
        goToPrevContent();
      }
      setIsDragging(false);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const goToNextContent = () => {
    setContentIndex((prev) => (prev + 1) % activeTopic.content.length);
  };
  
  const goToPrevContent = () => {
    setContentIndex((prev) => (prev - 1 + activeTopic.content.length) % activeTopic.content.length);
  };

  return (
    <div className="mb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Pengetahuan Perikanan
      </h2>
      
      {/* Tab navigation - horizontally scrollable on mobile */}
      <div 
        ref={tabsContainerRef}
        className={cn(
          "flex mb-6 overflow-x-auto scrollbar-hide",
          isMobile ? "pb-2 gap-2" : "justify-center gap-2"
        )}
      >
        {fisheryTopics.map((topic) => (
          <button
            key={topic.id}
            id={`tab-${topic.id}`}
            onClick={() => {
              setActiveTab(topic.id);
              setContentIndex(0);
            }}
            className={cn(
              "flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300",
              activeTab === topic.id
                ? theme === "light"
                  ? "bg-ocean-blue text-white"
                  : "bg-primary text-primary-foreground"
                : theme === "light"
                ? "bg-ocean-blue/10 hover:bg-ocean-blue/20 text-ocean-blue"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            <span className="mr-2">{topic.icon}</span>
            {topic.title}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="relative max-w-3xl mx-auto">
        <div 
          className={cn(
            "p-6 rounded-lg",
            theme === "light" 
              ? "bg-ocean-blue/5 border border-ocean-blue/20"
              : "bg-primary/5 border border-primary/20"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {/* Progress indicator */}
          <div className="flex gap-1 mb-4 justify-center">
            {activeTopic.content.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === contentIndex 
                    ? theme === "light" 
                      ? "bg-ocean-blue w-8" 
                      : "bg-primary w-8" 
                    : "bg-gray-300 w-3"
                )}
              />
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${contentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px] flex flex-col"
            >
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                theme === "light" ? "text-ocean-blue" : "text-primary"
              )}>
                {activeContent.title}
              </h3>
              <p className="text-muted-foreground">
                {activeContent.description}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevContent}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                theme === "light"
                  ? "hover:bg-ocean-blue/10 text-ocean-blue"
                  : "hover:bg-primary/10 text-primary"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {contentIndex + 1}/{activeTopic.content.length}
            </span>
            <button
              onClick={goToNextContent}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                theme === "light"
                  ? "hover:bg-ocean-blue/10 text-ocean-blue"
                  : "hover:bg-primary/10 text-primary"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
