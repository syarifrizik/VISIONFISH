
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Download, Phone, X } from "lucide-react";
import { captureScreenshot, shareToWhatsApp } from "@/utils/screenshot-utils";
import { toast } from 'sonner';

interface ShareDialogProps {
  elementId: string;
  title: string;
  speciesName?: string;
}

const ShareDialog = ({ elementId, title, speciesName = "Ikan" }: ShareDialogProps) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Take screenshot when dialog opens
  useEffect(() => {
    if (isOpen) {
      captureScreenshot(elementId, "visionfish-results.png").then(url => {
        setScreenshotUrl(url);
      });
    }
  }, [isOpen, elementId]);
  
  const handleDownloadImage = () => {
    if (!screenshotUrl) {
      toast.error("Screenshot belum siap, mohon tunggu");
      return;
    }
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `VisionFish-${speciesName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Screenshot berhasil diunduh");
    
    // Play screenshot sound
    playScreenshotSound();
  };
  
  // Function to play screenshot sound
  const playScreenshotSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdH2Hd2NfcIeQlo+JhYmRkoyDfXyEkZeMgnt9hIqPjYmDhIeKi4eBfHx8goeKioaCgIOHioiEgH+BhYmIhoJ/gIOFhoaDgICChIWEg4GBgoSFhIOCgYGDhISDgoCBgoOEg4KBgYKDg4OCgYGBgoODgoKBgYKCgoKBgYGBgoKCgoGBgYGCgoGBgYGBgYKCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgoKBgYGBgYKCgYGBgYKCgoKBgYGCgoKCgYGCgoODgoGBgoODg4KBgYODg4OCgYKDhISDgoGChISEg4GBg4SFhIKBgoSFhYSCgYOFhoWDgIKFhoaFgoGEhoeGg4GDhoiHhIKCh4iJh4SBhImJiYaBg4qLioiDgYaLjIuGgYSKjIyJg4GHi42LhYKFio2MiIOCiIyOi4aBhYqNjYmEgoeLjoyHgYWJjY6KhIKGio6NiISDiIuOjIeChouOjYmEg4iMjoyCgYaKjIyHg4SHi46OiYSEiIyOi4eDhYqMjYqFg4eKjIyIg4SIi4yLh4OFiYuMiYWDh4mLi4iFhIeJi4qHhIaIiouJhoSGiImKiIaFhoiJiYeGhYeHiIiHhoaGh4eHhoaGh4eHh4aGhoaHh4aGhoaGhoaGhoaGhoaGhoWFhoaGhoaFhYWFhoaFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEhISFhYWFhISEhISFhYSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIQQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEhISFhYWFhISEhYWFhYSEhISFhYWFhISEhYWFhYSEhIWFhYWEhISFhYWFhISEhIWFhYSEhIWFhYWEhISFhoaFhISFhoaGhYSEhYaGhoWEhIWGhoaFhIWFhoaGhYSFhoeHhoWEhYaHh4aFhIWGh4eGhYSFhoeHhoWFhYeHh4aFhYWHh4eGhYWFh4eHhoWFhoeHh4aFhYaHh4eGhYWGh4eHhoWFhoeHh4aFhoeHh4eGhYaHh4eHhoaGh4eHh4aGhoeHh4eGhoaHh4eHhoaGh4eHh4aGhoeHh4eGhoaHh4eHhoaGh4eHh4aGhoeHh4aGhoaHh4aGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGgoAA");
    audio.play().catch(err => console.error("Error playing sound:", err));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-visionfish-neon-blue/50 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10 hover:border-visionfish-neon-blue"
        >
          <Share className="w-4 h-4 mr-2" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-visionfish-neon-blue/30">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Share className="w-5 h-5" /> Bagikan {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {screenshotUrl && (
            <div className="relative rounded-md overflow-hidden border border-visionfish-neon-blue/30 dark:border-visionfish-neon-blue/50">
              <img 
                src={screenshotUrl} 
                alt="Preview" 
                className="w-full h-auto" 
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="bg-[#25D366] hover:bg-[#20BD5C] text-white"
              onClick={() => {
                if (!screenshotUrl) {
                  toast.error("Screenshot belum siap, mohon tunggu");
                  return;
                }
                shareToWhatsApp(`Hasil analisis ${speciesName} dari VisionFish.io`, screenshotUrl);
                playScreenshotSound();
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownloadImage}
              disabled={!screenshotUrl}
              className="col-span-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Gambar
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
            >
              <X className="w-4 h-4 mr-2" />
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
