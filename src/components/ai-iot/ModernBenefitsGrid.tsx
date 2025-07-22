
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { WifiIcon, Database, Bot, Leaf, Zap, Shield, TrendingUp, Clock } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "Monitoring Real-time",
    description: "Pantau kondisi perairan kapan saja dan di mana saja secara langsung dengan akurasi tinggi",
    icon: WifiIcon,
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    title: "Analisis Data Mendalam",
    description: "Analisis tren dan pola dengan machine learning untuk pengambilan keputusan yang lebih baik",
    icon: Database,
    gradient: "from-purple-500 to-pink-400"
  },
  {
    title: "AI-Powered Alerts",
    description: "Dapatkan notifikasi cerdas dan prediktif saat parameter air mencapai nilai kritis",
    icon: Bot,
    gradient: "from-green-500 to-emerald-400"
  },
  {
    title: "Efisiensi Maksimal",
    description: "Tingkatkan hasil produksi hingga 40% dan kurangi biaya operasional dengan otomasi cerdas",
    icon: Leaf,
    gradient: "from-orange-500 to-yellow-400"
  },
  {
    title: "Respon Instan",
    description: "Sistem respons otomatis dalam hitungan detik untuk mencegah kerugian besar",
    icon: Zap,
    gradient: "from-indigo-500 to-purple-400"
  },
  {
    title: "Keamanan Data",
    description: "Enkripsi end-to-end dan cloud backup untuk menjamin keamanan data perikanan Anda",
    icon: Shield,
    gradient: "from-teal-500 to-cyan-400"
  },
  {
    title: "Prediksi Akurat",
    description: "Prediksi kondisi perairan hingga 7 hari ke depan dengan akurasi 95%",
    icon: TrendingUp,
    gradient: "from-pink-500 to-rose-400"
  },
  {
    title: "Operasi 24/7",
    description: "Sistem monitoring tanpa henti dengan uptime 99.9% dan maintenance otomatis",
    icon: Clock,
    gradient: "from-violet-500 to-purple-400"
  }
];

const ModernBenefitsGrid = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-8"
      >
        <h3 className="text-2xl sm:text-3xl font-bold">
          Mengapa Memilih Sistem IoT Kami?
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Solusi terintegrasi dengan teknologi terdepan untuk mengoptimalkan operasional perikanan Anda
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className={cn(
              "h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500",
              "bg-gradient-to-br backdrop-blur-sm",
              theme === "light" 
                ? "from-white/90 to-gray-50/90 hover:shadow-blue-500/10" 
                : "from-slate-900/90 to-slate-800/90 hover:shadow-cyan-500/20",
              "border border-white/10 group-hover:border-white/20"
            )}>
              <CardContent className="p-6 space-y-4">
                {/* Icon with gradient background */}
                <div className="relative">
                  <motion.div
                    className={cn(
                      "p-4 rounded-2xl bg-gradient-to-br inline-block",
                      benefit.gradient
                    )}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  {/* Glow effect */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300",
                      benefit.gradient
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold group-hover:text-cyan-600 transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Hover effect bar */}
                <motion.div
                  className={cn(
                    "h-1 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    benefit.gradient
                  )}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModernBenefitsGrid;
