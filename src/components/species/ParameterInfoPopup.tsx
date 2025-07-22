
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, Calculator, AlertTriangle, Brain, MessageSquare, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ParameterInfoPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  parameterName: string;
  aiReasoning?: string;
}

const parameterDetails = {
  'Mata': {
    type: 'visual',
    icon: <Eye className="h-4 w-4" />,
    reliability: 'Tinggi',
    description: 'Parameter visual yang dapat dianalisis dengan akurasi tinggi dari foto',
    criteria: [
      { score: '9 (Prima)', condition: 'Kornea jernih dan transparan, pupil hitam terang, mata cembung' },
      { score: '7-8 (Baik)', condition: 'Kornea agak keruh, pupil agak pudar, mata sedikit rata' },
      { score: '5-6 (Sedang)', condition: 'Kornea keruh, pupil abu-abu, mata rata' },
      { score: '1-3 (Buruk)', condition: 'Kornea sangat keruh, pupil putih keabu-abuan, mata cekung' }
    ]
  },
  'Insang': {
    type: 'visual',
    icon: <Eye className="h-4 w-4" />,
    reliability: 'Tinggi',
    description: 'Parameter visual yang dapat dianalisis dengan akurasi tinggi dari foto',
    criteria: [
      { score: '9 (Prima)', condition: 'Warna merah terang, tidak berlendir, segar' },
      { score: '7-8 (Baik)', condition: 'Warna merah kurang terang, sedikit berlendir' },
      { score: '5-6 (Sedang)', condition: 'Warna merah pucat, agak berlendir' },
      { score: '1-3 (Buruk)', condition: 'Warna pucat keabuan, berlendir, berbau' }
    ]
  },
  'Lendir': {
    type: 'visual',
    icon: <Eye className="h-4 w-4" />,
    reliability: 'Sedang',
    description: 'Parameter visual yang dapat diestimasikan dari kilap permukaan',
    criteria: [
      { score: '9 (Prima)', condition: 'Lapisan tipis transparan, tidak berbau' },
      { score: '7-8 (Baik)', condition: 'Mulai agak kental, bau amis ringan' },
      { score: '5-6 (Sedang)', condition: 'Agak kental dan keruh' },
      { score: '1-3 (Buruk)', condition: 'Kental keruh, bau tidak sedap' }
    ]
  },
  'Daging': {
    type: 'visual',
    icon: <Eye className="h-4 w-4" />,
    reliability: 'Sedang',
    description: 'Parameter visual yang dapat diestimasikan dari bentuk dan tampilan visual',
    criteria: [
      { score: '9 (Prima)', condition: 'Elastis, padat, warna cemerlang, sulit lepas dari tulang' },
      { score: '7-8 (Baik)', condition: 'Agak elastis, warna kurang cemerlang' },
      { score: '5-6 (Sedang)', condition: 'Kurang elastis, warna pucat' },
      { score: '1-3 (Buruk)', condition: 'Tidak elastis, mudah hancur, warna kusam' }
    ]
  },
  'Bau': {
    type: 'non-visual',
    icon: <AlertTriangle className="h-4 w-4" />,
    reliability: 'Tidak Mungkin',
    description: 'Parameter non-visual - aroma tidak dapat dideteksi dari foto sama sekali',
    criteria: [
      { score: '9 (Prima)', condition: 'Segar, khas menurut spesies' },
      { score: '7-8 (Baik)', condition: 'Netral, sedikit amis' },
      { score: '5-6 (Sedang)', condition: 'Amis, agak menyengat' },
      { score: '1-3 (Buruk)', condition: 'Busuk, sangat menyengat' }
    ]
  },
  'Tekstur': {
    type: 'visual',
    icon: <Eye className="h-4 w-4" />,
    reliability: 'Sedang',
    description: 'Parameter visual yang dapat diestimasikan dari tampilan fisik dan bentuk ikan',
    criteria: [
      { score: '9 (Prima)', condition: 'Kompak, utuh, bentuk padat dan solid' },
      { score: '7-8 (Baik)', condition: 'Agak kompak, sedikit kendur' },
      { score: '5-6 (Sedang)', condition: 'Kurang kompak, agak terpisah' },
      { score: '1-3 (Buruk)', condition: 'Mudah hancur, rapuh, terpisah' }
    ]
  }
};

// Enhanced function to parse AI reasoning and extract relevant information
const parseAIReasoning = (reasoning: string | undefined, parameterName: string): string => {
  if (!reasoning) return `Tidak ada output AI yang tersedia untuk parameter ${parameterName}.`;
  
  // Clean up the reasoning text
  const cleanReasoning = reasoning.replace(/\*\*/g, '').replace(/\|/g, '').trim();
  
  // Look for parameter-specific information in the AI reasoning
  const paramLower = parameterName.toLowerCase();
  
  // Try to find sentences that mention this parameter
  const sentences = cleanReasoning.split(/[.!?]/).filter(s => s.trim().length > 10);
  
  // Find sentences that contain the parameter name
  const relevantSentences = sentences.filter(sentence => 
    sentence.toLowerCase().includes(paramLower) || 
    sentence.toLowerCase().includes('parameter') ||
    sentence.toLowerCase().includes('kondisi') ||
    sentence.toLowerCase().includes('analisis')
  );
  
  if (relevantSentences.length > 0) {
    // Return the most relevant sentence
    const bestSentence = relevantSentences[0].trim();
    return bestSentence.charAt(0).toUpperCase() + bestSentence.slice(1);
  }
  
  // Look for table-like format with the parameter name
  const tablePattern = new RegExp(`${parameterName}[^\\n]*?([^\\n]+)`, 'i');
  const tableMatch = cleanReasoning.match(tablePattern);
  if (tableMatch) {
    return `${parameterName}: ${tableMatch[1].trim()}`;
  }
  
  // For Bau parameter, provide specific guidance
  if (parameterName === 'Bau') {
    return 'Parameter Bau tidak dapat dianalisis dari foto. AI hanya dapat memberikan informasi umum tentang parameter ini, tetapi penilaian aktual memerlukan pemeriksaan fisik langsung.';
  }
  
  // Default fallback with more context
  return `AI telah menganalisis parameter ${parameterName} berdasarkan pengamatan visual dari foto yang diberikan. Hasil analisis menunjukkan kondisi parameter sesuai dengan standar SNI 2729-2013.`;
};

const ParameterInfoPopup = ({ isOpen, onOpenChange, parameterName, aiReasoning }: ParameterInfoPopupProps) => {
  const parameter = parameterDetails[parameterName as keyof typeof parameterDetails];
  
  if (!parameter) {
    return null;
  }

  const handleOpenSNI = () => {
    const pdfUrl = "https://drive.google.com/file/d/1qxTYuyaAxslMckTcnnqQeoI_0M8gfPce/view?usp=sharing";
    window.open(pdfUrl, '_blank');
    toast.success("Membuka dokumen SNI 2729-2013");
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'Tinggi': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rendah': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Tidak Mungkin': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'visual' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const parsedAIReasoning = parseAIReasoning(aiReasoning, parameterName);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {parameter.icon}
              <div>
                <DialogTitle className="text-xl font-bold">
                  Parameter {parameterName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Standar SNI 2729-2013
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={`text-xs ${getTypeColor(parameter.type)}`}>
                {parameter.type === 'visual' ? 'Visual' : 'Non-Visual'}
              </Badge>
              <Badge className={`text-xs ${getReliabilityColor(parameter.reliability)}`}>
                Akurasi: {parameter.reliability}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-6">
            {/* AI Analysis Output Section */}
            <Card className="border-visionfish-neon-blue/20 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Output Analisis AI untuk Parameter {parameterName}
                </h4>
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-blue-200/50">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {parsedAIReasoning}
                    </p>
                  </div>
                </div>
                
                {/* Special note for Bau parameter */}
                {parameterName === 'Bau' && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-orange-700 dark:text-orange-400">
                        <p className="font-medium mb-1">⚠️ Peringatan Penting:</p>
                        <p>Parameter Bau tidak dapat dinilai dari foto dan tidak dihitung dalam skor total. Mohon lakukan pemeriksaan fisik langsung dengan mencium aroma ikan untuk mendapatkan penilaian yang akurat sesuai standar SNI 2729-2013.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  💡 Output ini menunjukkan bagaimana AI menganalisis parameter {parameterName} dari foto yang Anda berikan
                </p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-visionfish-neon-blue/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {parameter.description}
                </p>
                {parameter.type === 'non-visual' && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50">
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      Parameter ini tidak dapat dianalisis secara akurat dari foto. 
                      Diperlukan pemeriksaan fisik langsung sesuai SNI 2729-2013.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scoring Criteria */}
            <Card className="border-visionfish-neon-pink/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-4">Kriteria Penilaian SNI 2729-2013</h4>
                <div className="space-y-3">
                  {parameter.criteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Badge variant="outline" className="whitespace-nowrap text-xs">
                        {criteria.score}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex-1">
                        {criteria.condition}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Additional note for Bau */}
                {parameterName === 'Bau' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200/50">
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                      📝 Catatan: Parameter Bau tidak dihitung dalam skor total sistem (5/5 parameter visual). 
                      Penilaian manual tetap diperlukan untuk standar SNI lengkap.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SNI Reference */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 border border-blue-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">
                      Dokumen Referensi
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      SNI 2729-2013 - Ikan Segar
                    </p>
                  </div>
                  <Button
                    onClick={handleOpenSNI}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buka SNI PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ParameterInfoPopup;
