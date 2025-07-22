
import { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  imagePreview: string | null;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  tabId: string;
}

const ImageUploader = ({ imagePreview, handleImageUpload, tabId }: ImageUploaderProps) => {
  return (
    <div className="flex items-center justify-center w-full">
      <Label
        htmlFor={`dropzone-file-${tabId}`}
        className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer 
          bg-background/40 border-visionfish-neon-blue hover:bg-visionfish-neon-blue/5 transition-all duration-300 
          relative after:absolute after:inset-0 after:content-[''] after:shadow-neon-blue after:opacity-50 after:rounded-lg 
          after:z-[-1] group overflow-hidden dark:border-visionfish-neon-blue/70 dark:hover:border-visionfish-neon-blue"
      >
        {imagePreview ? (
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-full w-full object-contain rounded-lg p-2"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="p-3 bg-visionfish-neon-blue/20 rounded-full animate-pulse-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <span className="ml-2 text-white font-medium">Ubah Gambar</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-4 rounded-full bg-visionfish-neon-blue/20 mb-4 animate-pulse-glow">
              <ImageIcon className="w-10 h-10 text-visionfish-neon-blue" />
            </div>
            <p className="mb-2 text-foreground">
              <span className="font-semibold">Klik untuk upload</span> atau drag & drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (Max. 10MB)</p>
            <div className="mt-4 border border-visionfish-neon-blue/30 dark:border-visionfish-neon-blue/50 bg-visionfish-neon-blue/5 text-xs text-center p-2 rounded-md">
              <p className="text-visionfish-neon-blue font-medium">Tips: Gunakan gambar dengan pencahayaan yang baik</p>
            </div>
          </div>
        )}
        <input
          id={`dropzone-file-${tabId}`}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleImageUpload}
        />
      </Label>
    </div>
  );
};

export default ImageUploader;
