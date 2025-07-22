
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const FeatureComparisonTable = () => {
  const isMobile = useIsMobile();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Analisis Gambar": true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const features = [
    {
      category: "Analisis Gambar",
      items: [
        { feature: "Identifikasi Spesies Ikan", free: true, premium: true },
        { feature: "Analisis Kesegaran Ikan", free: true, premium: true },
        { feature: "Batas Upload Harian", free: "5 gambar", premium: "Unlimited" },
        { feature: "Akurasi Analisis", free: "Standard", premium: "VisionFish AI Premium" },
        { feature: "Laporan PDF Detil", free: false, premium: true },
      ],
    },
    {
      category: "AI Chat Assistant",
      items: [
        { feature: "Chat dengan VisionFish AI", free: true, premium: true },
        { feature: "Batas Chat Harian", free: "10 pesan", premium: "Unlimited" },
        { feature: "Model AI", free: "VisionFish Basic", premium: "VisionFish Premium" },
        { feature: "Riwayat Chat", free: "7 hari", premium: "Selamanya" },
        { feature: "Expert Knowledge", free: false, premium: true },
      ],
    },
    {
      category: "Data & Analytics",
      items: [
        { feature: "Info Cuaca Saat Ini", free: true, premium: true },
        { feature: "Data Historis Cuaca", free: false, premium: true },
        { feature: "Prediksi Cuaca 7 Hari", free: true, premium: true },
        { feature: "Analisis Trend Musiman", free: false, premium: true },
        { feature: "Export Data", free: false, premium: true },
      ],
    },
    {
      category: "Komunitas & Sharing",
      items: [
        { feature: "Akses Chatroom", free: true, premium: true },
        { feature: "Upload Foto di Chat", free: true, premium: true },
        { feature: "Promosi Produk", free: "3/hari", premium: "Unlimited" },
        { feature: "Pin Message", free: false, premium: true },
        { feature: "Priority Support", free: false, premium: true },
      ],
    },
    {
      category: "Fitur Profile",
      items: [
        { feature: "Profile Publik", free: true, premium: true },
        { feature: "Upload Achievement", free: "5/bulan", premium: "Unlimited" },
        { feature: "Private Notes", free: "10 notes", premium: "Unlimited" },
        { feature: "Analytics Detail", free: false, premium: true },
        { feature: "Custom Profile Theme", free: false, premium: true },
      ],
    },
  ];

  return (
    <section className="px-4 md:px-6 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Bandingkan <span className="text-visionfish-neon-pink">Fitur</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Lihat perbandingan lengkap antara akun Free dan Premium untuk memahami 
            nilai yang Anda dapatkan dengan upgrade.
          </p>
        </motion.div>

        {/* Mobile: Collapsible Cards */}
        {isMobile ? (
          <div className="space-y-4">
            {features.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Collapsible
                  open={openCategories[category.category]}
                  onOpenChange={() => toggleCategory(category.category)}
                >
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-visionfish-neon-pink" />
                            {category.category}
                          </div>
                          {openCategories[category.category] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-0">
                        {/* Mobile Header */}
                        <div className="grid grid-cols-3 border-b bg-muted/20 text-sm font-medium">
                          <div className="p-3">Fitur</div>
                          <div className="p-3 text-center border-l">
                            <Badge variant="outline" className="text-xs">Free</Badge>
                          </div>
                          <div className="p-3 text-center border-l bg-gradient-to-r from-visionfish-neon-pink/10 to-visionfish-neon-purple/10">
                            <Badge className="bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple text-white text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        </div>

                        {/* Feature Rows */}
                        {category.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="grid grid-cols-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors text-sm"
                          >
                            <div className="p-3 font-medium">{item.feature}</div>
                            
                            {/* Free Column */}
                            <div className="p-3 text-center border-l">
                              {typeof item.free === 'boolean' ? (
                                item.free ? (
                                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mx-auto" />
                                )
                              ) : (
                                <span className="text-xs text-muted-foreground">{item.free}</span>
                              )}
                            </div>
                            
                            {/* Premium Column */}
                            <div className="p-3 text-center border-l bg-gradient-to-r from-visionfish-neon-pink/5 to-visionfish-neon-purple/5">
                              {typeof item.premium === 'boolean' ? (
                                item.premium ? (
                                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mx-auto" />
                                )
                              ) : (
                                <span className="text-xs font-medium text-visionfish-neon-pink">
                                  {item.premium}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        ) : (
          // Desktop: Full Table View
          <div className="space-y-8">
            {features.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="w-5 h-5 text-visionfish-neon-pink" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 border-b">
                      <div className="p-4 font-medium">Fitur</div>
                      <div className="p-4 font-medium text-center border-l">
                        <Badge variant="outline">Free</Badge>
                      </div>
                      <div className="p-4 font-medium text-center border-l bg-gradient-to-r from-visionfish-neon-pink/10 to-visionfish-neon-purple/10">
                        <Badge className="bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    </div>

                    {/* Feature Rows */}
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className="grid grid-cols-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <div className="p-4 font-medium">{item.feature}</div>
                        
                        {/* Free Column */}
                        <div className="p-4 text-center border-l">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{item.free}</span>
                          )}
                        </div>
                        
                        {/* Premium Column */}
                        <div className="p-4 text-center border-l bg-gradient-to-r from-visionfish-neon-pink/5 to-visionfish-neon-purple/5">
                          {typeof item.premium === 'boolean' ? (
                            item.premium ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-visionfish-neon-pink">
                              {item.premium}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            Siap untuk mengupgrade pengalaman memancing Anda?
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Crown className="w-4 h-4 text-visionfish-neon-pink" />
            Premium mulai dari <span className="font-bold text-visionfish-neon-pink">Rp49.000/bulan</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureComparisonTable;
