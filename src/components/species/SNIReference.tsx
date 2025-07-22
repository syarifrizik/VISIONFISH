
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Download, Share2, Eye, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SNIReferenceProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SNIReference = ({ isOpen, onOpenChange }: SNIReferenceProps) => {
  const pdfUrl = "https://drive.google.com/file/d/1qxTYuyaAxslMckTcnnqQeoI_0M8gfPce/view?usp=sharing";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Standar SNI 2729-2013 Ikan Segar",
          text: "Panduan lengkap standar SNI untuk penilaian kesegaran ikan",
          url: pdfUrl
        });
        toast.success("Berhasil membagikan dokumen SNI");
      } else {
        await navigator.clipboard.writeText(pdfUrl);
        toast.success("Link dokumen SNI berhasil disalin");
      }
    } catch (error) {
      toast.error("Gagal membagikan dokumen");
    }
  };

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
    toast.success("Membuka dokumen SNI di tab baru");
  };

  const sectionData = [
    {
      title: "Parameter Organoleptic",
      icon: <Eye className="h-5 w-5" />,
      items: [
        {
          parameter: "Mata",
          excellent: "Kornea jernih dan transparan, pupil hitam terang",
          good: "Kornea agak keruh, pupil agak pudar",
          poor: "Kornea keruh, pupil abu-abu"
        },
        {
          parameter: "Insang", 
          excellent: "Warna merah terang, tidak berlendir",
          good: "Warna merah kurang terang, sedikit berlendir",
          poor: "Warna pucat keabuan, berlendir"
        },
        {
          parameter: "Lendir",
          excellent: "Lapisan tipis transparan, tidak berbau",
          good: "Mulai agak kental, bau amis ringan", 
          poor: "Kental keruh, bau tidak sedap"
        }
      ]
    },
    {
      title: "Skala Penilaian SNI",
      icon: <Award className="h-5 w-5" />,
      items: [
        {
          parameter: "Prima (9)",
          excellent: "Kondisi sangat segar, semua parameter optimal",
          good: "",
          poor: ""
        },
        {
          parameter: "Baik (7-8)",
          excellent: "Kondisi segar, kualitas baik untuk konsumsi",
          good: "",
          poor: ""
        },
        {
          parameter: "Sedang (5-6)", 
          excellent: "Kualitas menurun, segera konsumsi/olah",
          good: "",
          poor: ""
        },
        {
          parameter: "Busuk (1-3)",
          excellent: "Tidak layak konsumsi, tanda pembusukan",
          good: "",
          poor: ""
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-visionfish-neon-pink" />
                Standar SNI 2729-2013
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Panduan Penilaian Kesegaran Ikan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-visionfish-neon-blue/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-visionfish-neon-pink/30"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-6">
            {sectionData.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
              >
                <Card className="border-2 border-visionfish-neon-blue/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {section.icon}
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-4 border-blue-200 pl-4">
                          <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300">
                            {item.parameter}
                          </h4>
                          <div className="space-y-2 text-sm">
                            {item.excellent && (
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
                                  Baik
                                </Badge>
                                <span className="text-muted-foreground">{item.excellent}</span>
                              </div>
                            )}
                            {item.good && (
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs whitespace-nowrap">
                                  Sedang
                                </Badge>
                                <span className="text-muted-foreground">{item.good}</span>
                              </div>
                            )}
                            {item.poor && (
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="bg-red-100 text-red-800 text-xs whitespace-nowrap">
                                  Buruk
                                </Badge>
                                <span className="text-muted-foreground">{item.poor}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Additional Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 border border-blue-200/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">
                      Tentang Dokumen SNI 2729-2013
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed mb-3">
                      Standar Nasional Indonesia (SNI) 2729-2013 adalah panduan resmi dari Badan Standardisasi Nasional (BSN) 
                      untuk penilaian kualitas dan kesegaran ikan segar. Dokumen ini menjadi acuan utama dalam sistem 
                      penilaian yang digunakan oleh aplikasi VisionFish.
                    </p>
                    <Button 
                      onClick={handleDownload}
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Unduh Dokumen Lengkap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SNIReference;
