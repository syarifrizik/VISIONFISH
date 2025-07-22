
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Shield, Info, Check } from "lucide-react";

const Privacy = () => {
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

  const sections = [
    {
      id: 1,
      title: "Informasi yang Kami Kumpulkan",
      content: [
        "Informasi Pendaftaran: Nama, alamat email, nomor telepon",
        "Informasi Lokasi: Lokasi geografis untuk fitur cuaca dan peramalan memancing",
        "Konten Pengguna: Foto ikan yang diunggah untuk identifikasi dan analisis",
        "Data Penggunaan: Informasi tentang cara Anda berinteraksi dengan aplikasi kami"
      ]
    },
    {
      id: 2,
      title: "Cara Kami Menggunakan Informasi",
      content: [
        "Menyediakan dan meningkatkan layanan VisionFish",
        "Memproses dan menganalisis gambar ikan yang Anda unggah",
        "Memberikan informasi cuaca dan perkiraan memancing yang relevan",
        "Meningkatkan algoritma AI kami untuk identifikasi spesies dan kesegaran ikan",
        "Berkomunikasi dengan Anda tentang pembaruan dan fitur baru"
      ]
    },
    {
      id: 3,
      title: "Berbagi Informasi",
      content: [
        "Dengan persetujuan Anda",
        "Dengan penyedia layanan yang membantu menjalankan aplikasi kami",
        "Jika diwajibkan oleh hukum",
        "Dalam kasus penggabungan, akuisisi, atau penjualan aset"
      ],
      note: "Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi Anda dalam keadaan terbatas:"
    },
    {
      id: 4,
      title: "Keamanan Data",
      content: [],
      paragraph: "Kami mengimplementasikan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data Anda dari akses yang tidak sah, perubahan, pengungkapan, atau penghancuran yang tidak sah."
    },
    {
      id: 5,
      title: "Retensi Data",
      content: [],
      paragraph: "Kami akan menyimpan data Anda hanya selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini, kecuali jika periode retensi yang lebih lama diperlukan atau diizinkan oleh hukum."
    },
    {
      id: 6,
      title: "Hak-Hak Anda",
      content: [
        "Akses dan mendapatkan salinan data Anda",
        "Meminta koreksi atau penghapusan data Anda",
        "Membatasi atau menolak pemrosesan data Anda",
        "Meminta portabilitas data Anda"
      ],
      note: "Anda memiliki hak berikut terkait dengan data pribadi Anda:"
    },
    {
      id: 7,
      title: "Perubahan Kebijakan",
      content: [],
      paragraph: "Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan dengan memposting kebijakan baru di situs web kami dan memperbarui tanggal \"terakhir diperbarui\"."
    },
    {
      id: 8,
      title: "Hubungi Kami",
      content: [],
      paragraph: "Jika Anda memiliki pertanyaan atau kekhawatiran tentang kebijakan privasi kami atau praktik data kami, silakan hubungi kami melalui halaman Kontak."
    }
  ];
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center mb-8"
        >
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center mb-4",
            theme === "light" 
              ? "bg-ocean-light/20" 
              : "bg-visionfish-neon-blue/20"
          )}>
            <Shield className={cn(
              "h-8 w-8",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )} />
          </div>
          <h1 className={cn(
            "text-3xl sm:text-4xl font-bold text-center",
            theme === "light"
              ? "bg-gradient-to-r from-ocean-blue to-ocean-teal bg-clip-text text-transparent"
              : "bg-gradient-to-r from-visionfish-neon-purple to-visionfish-neon-blue bg-clip-text text-transparent"
          )}>
            Kebijakan Privasi
          </h1>
        </motion.div>
        
        <motion.div 
          variants={fadeUp}
          custom={1}
          initial="initial"
          animate="animate"
          className={cn(
            "mb-10 p-6 rounded-lg",
            theme === "light"
              ? "bg-ocean-light/10 border border-ocean-light/30"
              : "bg-visionfish-neon-blue/10 border border-visionfish-neon-blue/30"
          )}
        >
          <div className="flex items-start gap-3">
            <Info className={cn(
              "h-5 w-5 mt-0.5 flex-shrink-0",
              theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
            )} />
            <p className="text-lg">
              Kebijakan Privasi ini menjelaskan bagaimana VisionFish mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan aplikasi dan layanan kami. Kami berkomitmen untuk melindungi privasi Anda dan menangani data Anda dengan transparan.
            </p>
          </div>
        </motion.div>
        
        <div className="prose dark:prose-invert max-w-none">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              variants={fadeUp}
              custom={index + 2}
              initial="initial"
              animate="animate"
              className="mb-12"
            >
              <h2 className={cn(
                "flex items-center text-2xl font-semibold mb-4 gap-2",
                theme === "light" ? "text-ocean-blue" : "text-visionfish-neon-blue"
              )}>
                <span className={cn(
                  "inline-block h-7 w-7 rounded-full flex items-center justify-center text-white text-sm",
                  theme === "light" ? "bg-ocean-teal" : "bg-visionfish-neon-blue"
                )}>
                  {section.id}
                </span>
                {section.title}
              </h2>
              
              {section.note && (
                <p className="mb-3">{section.note}</p>
              )}
              
              {section.paragraph && (
                <p className="mb-4">{section.paragraph}</p>
              )}
              
              {section.content.length > 0 && (
                <ul className="list-none pl-0 mb-6 space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={cn(
                        "h-5 w-5 mr-2 flex-shrink-0",
                        theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue"
                      )} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
          
          <motion.div 
            variants={fadeUp}
            custom={sections.length + 2}
            initial="initial"
            animate="animate"
            className={cn(
              "mt-12 p-4 rounded-lg text-right",
              theme === "light"
                ? "bg-gray-50 border border-gray-100"
                : "bg-gray-800/30 border border-gray-700"
            )}
          >
            <p className="italic text-sm mb-0">Terakhir diperbarui: 17 Mei 2025</p>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Privacy;
