
import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

interface InfoBoxProps {
  title: string;
  children?: ReactNode;
}

const InfoBox = ({ title, children }: InfoBoxProps) => (
  <div className="bg-visionfish-neon-blue/10 dark:bg-visionfish-neon-blue/20 p-3 rounded-md text-center flex flex-col h-full border border-visionfish-neon-blue/30 dark:border-visionfish-neon-blue/70 hover:border-visionfish-neon-blue/60 dark:hover:border-visionfish-neon-blue/90 transition-all duration-300">
    <p className="font-semibold mb-1">{title}</p>
    {children && <div className="flex-1 flex items-center justify-center text-sm">{children}</div>}
  </div>
);

interface SpeciesInfoBoxesProps {
  analysisResult: string | null;
  isLoading?: boolean;
}

// Helper function to extract values from markdown table
export const extractTableData = (markdown: string): Record<string, string> => {
  const result: Record<string, string> = {
    "Nama Lokal": "",
    "Nama Ilmiah": "",
    "Famili": "",
    "Habitat": "",
    "Distribusi": "",
    "Karakteristik": "",
    "Status Konservasi": "",
    "Nilai Ekonomi": ""
  };
  
  if (!markdown) return result;
  
  // Match table rows in markdown - fix type inference issue
  const matchResult = markdown.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
  const rows = matchResult ? matchResult : [];
  
  // Extract key-value pairs
  rows.forEach(row => {
    const match = row.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
    if (match && match.length === 3) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key in result) {
        result[key] = value;
      }
    }
  });
  
  return result;
};

// Helper function to extract conclusion from AI analysis result with improved extraction
export const extractConclusion = (analysisResult: string | null): string => {
  if (!analysisResult) return "";
  
  // Try to find the detailed conclusion section with specific format
  const detailedConclusionRegex = /Berdasarkan analisis visual[\s\S]*?(?=\n\n|\n#|$)/i;
  const detailedMatch = analysisResult.match(detailedConclusionRegex);
  
  if (detailedMatch && detailedMatch[0]) {
    return detailedMatch[0].trim();
  }
  
  // Try to find conclusion section in AI response with more thorough extraction
  const fullConclusionRegex = /Kesimpulan:([^#]+?)(?=\n\n|\n#|$)/is;
  const shortConclusionRegex = /Kesimpulan:(.+?)(?=\n\n|$)/i;
  
  // Try the full multi-line conclusion extraction first
  const fullMatch = analysisResult.match(fullConclusionRegex);
  if (fullMatch && fullMatch[1]) {
    return `Berdasarkan analisis visual menggunakan teknologi OpenCV, VisionFish mendeteksi:\n\n${fullMatch[1].trim()}`;
  }
  
  // Try the shorter single-line extraction
  const shortMatch = analysisResult.match(shortConclusionRegex);
  if (shortMatch && shortMatch[1]) {
    return `Berdasarkan analisis visual menggunakan teknologi OpenCV, VisionFish menyimpulkan:\n\n${shortMatch[1].trim()}`;
  }
  
  // If no specific conclusion section, try to get last paragraph that isn't a table row
  const paragraphs = analysisResult.split('\n\n');
  for (let i = paragraphs.length - 1; i >= 0; i--) {
    const paragraph = paragraphs[i];
    if (!paragraph.includes('|') && paragraph.trim().length > 25) {
      return `Berdasarkan analisis visual menggunakan teknologi OpenCV, VisionFish menyimpulkan:\n\n${paragraph.trim()}`;
    }
  }
  
  return "";
};

const SpeciesInfoBoxes = ({ analysisResult, isLoading = false }: SpeciesInfoBoxesProps) => {
  const extractedData = analysisResult ? extractTableData(analysisResult) : null;
  
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <InfoBox title="Nama Lokal">
        {isLoading ? (
          <div className="h-5 w-3/4 mx-auto bg-visionfish-neon-blue/20 dark:bg-visionfish-neon-blue/30 animate-pulse rounded"></div>
        ) : extractedData?.["Nama Lokal"] ? (
          <span className="font-medium text-foreground">{extractedData["Nama Lokal"]}</span>
        ) : null}
      </InfoBox>
      <InfoBox title="Nama Ilmiah">
        {isLoading ? (
          <div className="h-5 w-3/4 mx-auto bg-visionfish-neon-blue/20 dark:bg-visionfish-neon-blue/30 animate-pulse rounded"></div>
        ) : extractedData?.["Nama Ilmiah"] ? (
          <span className="italic font-medium text-foreground">{extractedData["Nama Ilmiah"]}</span>
        ) : null}
      </InfoBox>
      <InfoBox title="Famili">
        {isLoading ? (
          <div className="h-5 w-3/4 mx-auto bg-visionfish-neon-blue/20 dark:bg-visionfish-neon-blue/30 animate-pulse rounded"></div>
        ) : extractedData?.["Famili"] ? (
          <span className="font-medium text-foreground">{extractedData["Famili"]}</span>
        ) : null}
      </InfoBox>
    </div>
  );
};

export default SpeciesInfoBoxes;
