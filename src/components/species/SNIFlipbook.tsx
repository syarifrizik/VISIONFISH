
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, BookOpen, Download, Share2, X } from 'lucide-react';
import { toast } from 'sonner';

interface SNIFlipbookProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const SNIFlipbook = ({ isOpen, onOpenChange, trigger }: SNIFlipbookProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const pdfUrl = "https://drive.google.com/file/d/1qxTYuyaAxslMckTcnnqQeoI_0M8gfPce/view?usp=sharing";
  const embedUrl = "https://drive.google.com/file/d/1qxTYuyaAxslMckTcnnqQeoI_0M8gfPce/preview";

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

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const FlipbookContent = () => (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Standar SNI 2729-2013</h3>
          <p className="text-sm text-muted-foreground">Panduan Penilaian Kesegaran Ikan</p>
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
            <Download className="h-4 w-4 mr-2" />
            Buka
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-visionfish-neon-blue border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">Memuat dokumen SNI...</p>
                </div>
              </div>
            )}

            {hasError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="text-center space-y-4 max-w-md mx-auto p-6">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold mb-2">Dokumen Tidak Dapat Dimuat</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Terjadi kesalahan saat memuat dokumen PDF. Silakan buka link langsung.
                    </p>
                    <Button onClick={handleDownload} className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka di Google Drive
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                className="border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Standar SNI 2729-2013 Ikan Segar"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200/50">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">
              Tentang Dokumen Ini
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Standar SNI 2729-2013 adalah panduan resmi dari Badan Standardisasi Nasional (BSN) 
              untuk penilaian kualitas dan kesegaran ikan segar. Dokumen ini menjadi acuan utama 
              dalam sistem penilaian yang digunakan oleh aplikasi VisionFish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Standar SNI 2729-2013</DialogTitle>
          </DialogHeader>
          <FlipbookContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 bg-background rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Standar SNI 2729-2013</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange?.(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
              <FlipbookContent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SNIFlipbook;
