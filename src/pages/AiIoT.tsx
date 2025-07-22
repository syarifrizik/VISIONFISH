import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bot, Cpu, ThermometerSun, Droplets, Wind, Waves, Leaf, WifiIcon, TreeDeciduous, Satellite, ArrowRight, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Import existing components
import ModernHeroSection from "@/components/ai-iot/ModernHeroSection";
import EnhancedIoTCard from "@/components/ai-iot/EnhancedIoTCard";
import LiveParameterDemo from "@/components/ai-iot/LiveParameterDemo";
import ModernBenefitsGrid from "@/components/ai-iot/ModernBenefitsGrid";

// Import new modern components
import ModernAIChatHero from "@/components/ai-iot/ModernAIChatHero";
import EnhancedAIChatComponent from "@/components/ai-iot/EnhancedAIChatComponent";
import MobileOptimizedHero from "@/components/ai-iot/MobileOptimizedHero";
import MobileSwipeCards from "@/components/ai-iot/MobileSwipeCards";
import MobileBottomSheet from "@/components/ai-iot/MobileBottomSheet";
import MobilePullToRefresh from "@/components/ai-iot/MobilePullToRefresh";
import MobileFloatingActions from "@/components/ai-iot/MobileFloatingActions";
const AiIoTPage = () => {
  const {
    theme
  } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("iot");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({
    title: "",
    content: null
  });
  const iotDeviceTypes = [{
    id: "aquaculture",
    title: "Smart Aquaculture",
    description: "Sistem pemantauan cerdas untuk tambak, keramba, dan budidaya perairan dengan AI analytics",
    icon: <Waves className="h-5 w-5" />,
    parameters: ["Suhu Air", "pH Air", "Oksigen Terlarut", "Salinitas", "Kekeruhan", "Amonia"],
    color: "from-blue-500 to-cyan-400"
  }, {
    id: "mangrove",
    title: "Eco-Tourism Mangrove",
    description: "Pemantauan ekosistem mangrove real-time untuk konservasi dan ekowisata berkelanjutan",
    icon: <TreeDeciduous className="h-5 w-5" />,
    parameters: ["Tinggi Air", "Kualitas Air", "Suhu Udara", "Kelembaban", "Curah Hujan", "Biodiversitas"],
    color: "from-green-500 to-emerald-400"
  }, {
    id: "fishing",
    title: "Smart Fishing Zones",
    description: "Pemantauan lokasi penangkapan ikan dengan satelit dan AI untuk hasil maksimal",
    icon: <Satellite className="h-5 w-5" />,
    parameters: ["Suhu Permukaan Laut", "Klorofil-a", "Salinitas", "Arus", "Cuaca", "Fish Density"],
    color: "from-indigo-500 to-purple-400"
  }];
  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 320;
      const currentScroll = containerRef.current.scrollLeft;
      const newScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      containerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth"
      });
    }
  };
  const handleWhatsAppContact = () => {
    window.open("https://wa.me/62895619313339?text=Saya tertarik dengan sistem IoT untuk perikanan", "_blank");
    toast.success("Membuka WhatsApp untuk konsultasi IoT");
  };
  const handleShareData = () => {
    if (navigator.share) {
      navigator.share({
        title: "Smart IoT Perikanan",
        text: "Lihat sistem IoT canggih untuk perikanan",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin");
    }
  };
  const handleLearnMore = () => {
    if (isMobile) {
      setBottomSheetContent({
        title: "Detail Sistem IoT",
        content: <div className="space-y-4">
            <p>Informasi lengkap tentang sistem IoT yang dipilih akan ditampilkan di sini.</p>
            <Button onClick={handleWhatsAppContact} className="w-full">
              Konsultasi Sekarang
            </Button>
          </div>
      });
      setShowBottomSheet(true);
    } else {
      handleWhatsAppContact();
    }
  };
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Data berhasil diperbarui");
  };
  const handleSettingsClick = () => {
    toast.info("Pengaturan akan segera tersedia");
  };
  const handleUpgrade = () => {
    navigate("/premium");
  };
  return <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div className={cn("absolute inset-0", theme === 'light' ? "bg-gradient-to-br from-sky-50/50 via-blue-50/30 to-cyan-50/50" : "bg-gradient-to-br from-slate-950/50 via-blue-950/30 to-slate-900/50")} animate={{
        background: theme === 'light' ? ["linear-gradient(to bottom right, rgb(240 249 255 / 0.5), rgb(239 246 255 / 0.3), rgb(236 254 255 / 0.5))", "linear-gradient(to bottom right, rgb(239 246 255 / 0.6), rgb(236 254 255 / 0.4), rgb(240 249 255 / 0.6))", "linear-gradient(to bottom right, rgb(240 249 255 / 0.5), rgb(239 246 255 / 0.3), rgb(236 254 255 / 0.5))"] : ["linear-gradient(to bottom right, rgb(2 6 23 / 0.5), rgb(30 58 138 / 0.3), rgb(15 23 42 / 0.5))", "linear-gradient(to bottom right, rgb(30 58 138 / 0.6), rgb(15 23 42 / 0.4), rgb(2 6 23 / 0.6))", "linear-gradient(to bottom right, rgb(2 6 23 / 0.5), rgb(30 58 138 / 0.3), rgb(15 23 42 / 0.5))"]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-8">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-2">
              <h1 className={cn("text-3xl sm:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent", activeTab === "iot" ? theme === "light" ? "from-blue-600 to-cyan-600" : "from-cyan-400 to-blue-400" : theme === "light" ? "from-purple-600 to-blue-600" : "from-purple-400 to-blue-400")}>
                {activeTab === "iot" ? "Smart IoT Perikanan" : "AI Assistant Premium"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "iot" ? "Teknologi monitoring terdepan untuk industri perikanan Indonesia" : "Assistant AI premium dengan kemampuan analisis mendalam dan konsultasi ahli"}
              </p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }}>
              <TabsList className={cn("bg-background/50 backdrop-blur-sm border border-white/20", "shadow-lg")}>
                <TabsTrigger value="iot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                  <Cpu className="h-4 w-4 mr-2" />
                  <span className={isMobile ? "hidden" : "inline"}>IoT System</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className={isMobile ? "hidden" : "inline"}>AI Assistant</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>
          </div>

          <TabsContent value="iot" className="mt-0 space-y-8">
            {isMobile ? <MobilePullToRefresh onRefresh={handleRefresh} className="space-y-6">
                <MobileOptimizedHero onConsultClick={handleWhatsAppContact} onAIChatClick={() => setActiveTab("ai")} />
                <MobileSwipeCards devices={iotDeviceTypes} onLearnMore={handleLearnMore} />
                <LiveParameterDemo onShare={handleShareData} />
                <ModernBenefitsGrid />
                <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8
            }} className={cn("relative overflow-hidden rounded-2xl p-6 text-center", "bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-teal-600/10", "border border-white/20 backdrop-blur-sm")}>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">
                      Siap Mengoptimalkan Operasional Perikanan Anda?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Bergabunglah dengan 500+ pelaku usaha perikanan yang telah merasakan 
                      peningkatan produktivitas hingga 40%.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-600 mb-1">500+</div>
                        <div className="text-xs text-muted-foreground">Pelanggan</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-600 mb-1">99.9%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-600 mb-1">24/7</div>
                        <div className="text-xs text-muted-foreground">Support</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </MobilePullToRefresh> : <>
                <ModernHeroSection onConsultClick={handleWhatsAppContact} onAIChatClick={() => setActiveTab("ai")} />
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <motion.div initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-bold">
                        Pilih Sistem IoT Anda
                      </h3>
                      <p className="text-muted-foreground">
                        Solusi monitoring yang disesuaikan dengan kebutuhan spesifik Anda
                      </p>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {iotDeviceTypes.map((device, index) => <EnhancedIoTCard key={device.id} device={device} index={index} onLearnMore={handleWhatsAppContact} />)}
                  </div>
                </div>
                <LiveParameterDemo onShare={handleShareData} />
                <ModernBenefitsGrid />
                <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8
            }} className={cn("relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center", "bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-teal-600/10", "border border-white/20 backdrop-blur-sm")}>
                  <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                    <motion.div initial={{
                  scale: 0.9
                }} animate={{
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.2
                }}>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                        Siap Mengoptimalkan Operasional Perikanan Anda?
                      </h3>
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Bergabunglah dengan 500+ pelaku usaha perikanan yang telah merasakan 
                        peningkatan produktivitas hingga 40% dengan sistem IoT kami.
                      </p>
                    </motion.div>

                    <motion.div initial={{
                  y: 20,
                  opacity: 0
                }} animate={{
                  y: 0,
                  opacity: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.4
                }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button size="lg" onClick={handleWhatsAppContact} className={cn("group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700", "text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300", "px-8 py-3")}>
                        <WifiIcon className="h-5 w-5 mr-2" />
                        <span>Konsultasi Gratis</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <Button size="lg" variant="outline" onClick={() => setActiveTab("ai")} className="border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-3">
                        <Bot className="h-5 w-5 mr-2" />
                        <span>Tanya AI Assistant</span>
                      </Button>
                    </motion.div>

                    <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.6
                }} className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600 mb-1">500+</div>
                        <div className="text-sm text-muted-foreground">Pelanggan</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600 mb-1">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600 mb-1">24/7</div>
                        <div className="text-sm text-muted-foreground">Support</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </>}
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-8" data-chat-area>
            {!isMobile && <ModernAIChatHero onStartChat={() => {}} onUpgrade={handleUpgrade} />}
            <EnhancedAIChatComponent />
          </TabsContent>
        </Tabs>
      </div>

      {isMobile && <>
          <MobileFloatingActions onConsultClick={handleWhatsAppContact} onAIChatClick={() => setActiveTab("ai")} onShareClick={handleShareData} onSettingsClick={handleSettingsClick} />

          <MobileBottomSheet isOpen={showBottomSheet} onClose={() => setShowBottomSheet(false)} title={bottomSheetContent.title}>
            {bottomSheetContent.content}
          </MobileBottomSheet>
        </>}
    </div>;
};
export default AiIoTPage;
