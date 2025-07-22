
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PremiumFAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apa saja yang termasuk dalam paket Premium?",
      answer: "Premium memberikan Anda akses unlimited ke semua fitur AI analysis, chat dengan model GPT-4 dan Claude, data historis cuaca 5 tahun, laporan PDF profesional, promosi produk unlimited, dan support prioritas dengan response time <2 jam."
    },
    {
      question: "Bagaimana cara pembayaran dan apakah aman?",
      answer: "Kami menggunakan Midtrans sebagai payment gateway yang aman dan terpercaya. Anda bisa bayar via transfer bank, kartu kredit, e-wallet (GoPay, OVO, DANA), atau bahkan di minimarket. Semua transaksi dienkripsi dengan standar keamanan internasional."
    },
    {
      question: "Apakah bisa cancel subscription kapan saja?",
      answer: "Ya, Anda bisa cancel subscription kapan saja tanpa ada penalti. Fitur premium akan tetap aktif sampai akhir periode yang sudah dibayar. Kami juga menyediakan 30 hari garansi uang kembali untuk new subscribers."
    },
    {
      question: "Apakah data saya aman dan private?",
      answer: "Keamanan data adalah prioritas utama kami. Semua data dienkripsi end-to-end dan disimpan di server yang memenuhi standar ISO 27001. Kami tidak akan pernah membagikan data personal Anda ke pihak ketiga tanpa persetujuan."
    },
    {
      question: "Bagaimana cara upgrade dari Free ke Premium?",
      answer: "Sangat mudah! Klik tombol 'Upgrade Sekarang', pilih metode pembayaran, dan selesaikan transaksi. Akun Premium Anda akan aktif langsung setelah pembayaran dikonfirmasi, biasanya dalam 1-2 menit."
    },
    {
      question: "Apakah fitur Premium available di mobile app?",
      answer: "Ya, semua fitur Premium dapat diakses melalui web browser di mobile device. Website kami fully responsive dan dioptimasi untuk penggunaan mobile. Native mobile app sedang dalam development dan akan segera available."
    },
    {
      question: "Bagaimana kalau saya butuh bantuan atau ada masalah?",
      answer: "Premium users mendapat support prioritas melalui live chat, email, atau WhatsApp dengan response time <2 jam. Tim support kami terdiri dari ahli perikanan dan teknisi yang siap membantu 24/7."
    },
    {
      question: "Apakah ada diskon untuk langganan tahunan?",
      answer: "Saat ini kami fokus pada paket bulanan untuk memberikan fleksibilitas maksimal. Namun, kami sering memberikan promo special dan early access ke fitur baru untuk loyal premium members. Follow media sosial kami untuk update promo terbaru."
    }
  ];

  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pertanyaan <span className="text-visionfish-neon-pink">Umum</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan tentang Premium? Temukan jawabannya di sini atau 
            hubungi tim support kami untuk bantuan personal.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                  >
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-visionfish-neon-pink" />
                      ) : (
                        <Plus className="w-5 h-5 text-visionfish-neon-pink" />
                      )}
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-visionfish-neon-pink/10 to-visionfish-neon-purple/10 rounded-2xl"
        >
          <h3 className="text-xl font-bold mb-2">Masih ada pertanyaan?</h3>
          <p className="text-muted-foreground mb-4">
            Tim support kami siap membantu Anda 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890?text=Halo, saya ingin tanya tentang Premium VisionFish"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              WhatsApp Support
            </a>
            <a
              href="mailto:support@visionfish.id"
              className="inline-flex items-center justify-center px-6 py-3 border border-visionfish-neon-pink text-visionfish-neon-pink rounded-lg hover:bg-visionfish-neon-pink hover:text-white transition-colors"
            >
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFAQSection;
