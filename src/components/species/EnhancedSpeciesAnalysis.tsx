
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, BookOpen, MapPin, Eye, Lightbulb, Star, CheckCircle, AlertTriangle, Info, Bot, Camera, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

interface EnhancedSpeciesAnalysisProps {
  analysisData: string;
  isVisible: boolean;
  hideSpeciesCard?: boolean; // New prop to control species card visibility
}

interface SpeciesData {
  speciesName: string;
  scientificName?: string;
  family?: string;
  confidence: 'high' | 'medium' | 'low';
  characteristics: string[];
  habitat?: string;
  distribution?: string;
  tips?: string[];
  description?: string;
}

/**
 * CONTEXT: AI-Powered Species Identification Component
 * Route: /species-id - Automated AI species identification using computer vision
 * Features: AI-powered species detection, confidence scoring, characteristic extraction
 * Analysis Type: Visual pattern recognition and taxonomic classification
 * 
 * Note: This differs from manual species entry (/fish-analysis) where users manually select species
 */
const EnhancedSpeciesAnalysis: React.FC<EnhancedSpeciesAnalysisProps> = ({
  analysisData,
  isVisible,
  hideSpeciesCard = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    characteristics: true,
    habitat: false,
    tips: false
  });

  // Enhanced clean text function to remove all markdown formatting and artifacts
  const cleanText = (text: string): string => {
    if (!text) return '';
    
    return text
      // Remove all markdown formatting
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/\|/g, '') // Remove table separators
      .replace(/#{1,6}\s*/g, '') // Remove headers
      .replace(/`/g, '') // Remove code backticks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
      
      // Remove bullet point artifacts
      .replace(/^[-•*]\s*/gm, '') // Remove bullet points at start of lines
      .replace(/[-•*]\s*$/gm, '') // Remove trailing bullet artifacts
      .replace(/^[-•*]\s*\*+\s*/gm, '') // Remove "- *" patterns
      .replace(/^\s*[-•*]\s*$/gm, '') // Remove lines with only bullet points
      
      // Clean up colons and other artifacts
      .replace(/^:\s*/gm, '') // Remove leading colons
      .replace(/^\s*:\s*/gm, '') // Remove indented colons
      
      // Remove empty lines and normalize whitespace
      .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/^\s+|\s+$/g, '') // Trim start and end
      .trim();
  };

  // AI-powered species identification parsing
  const parseSpeciesData = (data: string): SpeciesData => {
    // Extract species name using AI analysis patterns
    const speciesMatch = data.match(/\*\*(?:Nama Spesies|Species Name)\*\*[:\s]*([^\n\r|]+)/i) ||
                        data.match(/(?:spesies|species)[:\s]*\*\*([^*]+)\*\*/i) ||
                        data.match(/(nila|lele|tongkol|bandeng|gurame|mas|patin|bawal|kakap|baronang|kerapu|mujair|gabus|belut|udang)/i);
    
    const speciesName = cleanText(speciesMatch?.[1] || 'Spesies Tidak Teridentifikasi');

    // Extract scientific name from AI analysis
    const scientificMatch = data.match(/\*\*(?:Nama Ilmiah|Scientific Name)\*\*[:\s]*\*([^*]+)\*/i) ||
                           data.match(/nama ilmiah[:\s]*\*([^*]+)\*/i);
    const scientificName = scientificMatch?.[1] ? cleanText(scientificMatch[1]) : undefined;

    // Extract family from AI analysis
    const familyMatch = data.match(/\*\*(?:Famili|Family)\*\*[:\s]*([^\n\r|]+)/i);
    const family = familyMatch?.[1] ? cleanText(familyMatch[1]) : undefined;

    // Determine AI confidence level
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    const lowerData = data.toLowerCase();
    if (lowerData.includes('confidence: high') || lowerData.includes('tinggi') || lowerData.includes('yakin')) {
      confidence = 'high';
    } else if (lowerData.includes('confidence: low') || lowerData.includes('rendah') || lowerData.includes('tidak yakin')) {
      confidence = 'low';
    }

    // Extract AI-identified characteristics with improved parsing
    const characteristics: string[] = [];
    const bulletMatches = data.match(/[-•*]\s*([^\n\r]+)/g);
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        let char = match.replace(/[-•*]\s*/, ''); // Remove bullet point
        char = cleanText(char); // Apply enhanced cleaning
        
        // Additional filtering for quality characteristics
        if (char.length > 3 && char.length < 120 && 
            !char.match(/^[\s*-•:]*$/) && // Not just symbols
            !char.toLowerCase().includes('berdasarkan analisis') && // Filter generic phrases
            !char.toLowerCase().includes('gambar yang diunggah')) {
          characteristics.push(char);
        }
      });
    }

    // Extract habitat info from AI analysis
    const habitatMatch = data.match(/habitat[:\s]*([^\n\r.]+)/i);
    const habitat = habitatMatch?.[1] ? cleanText(habitatMatch[1]) : undefined;

    // Extract distribution info from AI analysis
    const distributionMatch = data.match(/distribusi[:\s]*([^\n\r.]+)/i);
    const distribution = distributionMatch?.[1] ? cleanText(distributionMatch[1]) : undefined;

    // Extract AI-generated description
    const descriptionMatch = data.match(/deskripsi[:\s]*\n([\s\S]*?)(?=\n\n|\n#|$)/i);
    let description: string | undefined;
    if (descriptionMatch?.[1]) {
      const cleanDesc = cleanText(descriptionMatch[1]);
      const genericPhrases = ['berdasarkan analisis visual', 'analisis visual gambar', 'gambar yang diunggah'];
      const isGeneric = genericPhrases.some(phrase => cleanDesc.toLowerCase().includes(phrase));
      
      if (!isGeneric && cleanDesc.length > 20) {
        description = cleanDesc.substring(0, 200) + (cleanDesc.length > 200 ? '...' : '');
      }
    }

    return {
      speciesName,
      scientificName,
      family,
      confidence,
      characteristics: characteristics.slice(0, 5),
      habitat,
      distribution,
      description
    };
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'low': return 'bg-gradient-to-r from-red-500 to-rose-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return 'Sedang';
    }
  };

  const getConfidenceDescription = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'AI sangat yakin dengan identifikasi ini berdasarkan karakteristik visual yang jelas';
      case 'medium': return 'AI cukup yakin dengan identifikasi ini, namun beberapa karakteristik mungkin kurang jelas';
      case 'low': return 'AI kurang yakin dengan identifikasi ini, disarankan untuk verifikasi lebih lanjut';
      default: return 'Tingkat keyakinan AI dalam identifikasi spesies';
    }
  };

  if (!isVisible || !analysisData) return null;

  const speciesData = parseSpeciesData(analysisData);

  console.log('AI-Powered EnhancedSpeciesAnalysis: Processing automated species identification', {
    context: 'AUTOMATED_SPECIES_IDENTIFICATION',
    route: '/species-id',
    analysisType: 'computer_vision_species',
    speciesName: speciesData.speciesName,
    confidence: speciesData.confidence,
    characteristicsCount: speciesData.characteristics.length
  });

  return (
    <TooltipProvider>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main AI Species Info Card - Conditionally rendered with enhanced context */}
          {!hideSpeciesCard && (
            <Card className="border-visionfish-neon-blue/30 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Fish className="w-6 h-6 text-visionfish-neon-blue" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xl font-bold">{speciesData.speciesName}</span>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              className={`${getConfidenceColor(speciesData.confidence)} text-white flex items-center gap-1 cursor-help`}
                            >
                              {getConfidenceIcon(speciesData.confidence)}
                              AI Confidence: {getConfidenceLabel(speciesData.confidence)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{getConfidenceDescription(speciesData.confidence)}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          AI Identified
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200 flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          Visual Recognition
                        </Badge>
                      </div>
                    </div>
                    {speciesData.scientificName && (
                      <p className="text-sm text-muted-foreground italic mt-1">
                        {speciesData.scientificName}
                      </p>
                    )}
                  </div>
                </CardTitle>
                
                {/* AI Context Information Banner */}
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/20 rounded-lg border border-blue-200/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">
                        Identifikasi Spesies Otomatis
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                        Spesies ini diidentifikasi secara otomatis menggunakan AI Computer Vision berdasarkan 
                        karakteristik visual dari gambar yang Anda unggah.
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Taxonomy Info with AI indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {speciesData.family && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-visionfish-neon-pink" />
                      <span className="text-sm font-medium">Famili (AI):</span>
                      <span className="text-sm">{speciesData.family}</span>
                    </div>
                  )}
                  {speciesData.habitat && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Habitat (AI):</span>
                      <span className="text-sm">{speciesData.habitat}</span>
                    </div>
                  )}
                </div>

                {/* AI-generated description */}
                {speciesData.description && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Bot className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-blue-600">Deskripsi AI:</span>
                    </div>
                    <p className="text-sm leading-relaxed">{speciesData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI-Identified Characteristics Section */}
          {!hideSpeciesCard && speciesData.characteristics.length > 0 && (
            <Card className="border-visionfish-neon-pink/30">
              <Collapsible
                open={expandedSections.characteristics}
                onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, characteristics: open }))}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-visionfish-neon-pink" />
                        Ciri-Ciri Visual (AI Detected)
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{speciesData.characteristics.length}</Badge>
                          <Badge className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            Auto-Extracted
                          </Badge>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.characteristics ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Star className="w-4 h-4" />
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {speciesData.characteristics.map((characteristic, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-visionfish-neon-pink rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{characteristic}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          {/* AI Species Identification Tips Section */}
          {!hideSpeciesCard && (
            <Card className="border-yellow-300/30 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 dark:from-yellow-950/10 dark:to-orange-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Tips Identifikasi Spesies dengan AI
                  <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    AI Enhanced
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">AI menganalisis bentuk tubuh, ukuran, dan proporsi ikan secara otomatis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Computer Vision mendeteksi pola warna, corak, dan tanda khusus</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">AI mengidentifikasi bentuk sirip, mulut, dan struktur kepala</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Gunakan gambar dengan pencahayaan optimal untuk akurasi AI terbaik</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Confidence score menunjukkan tingkat keyakinan AI dalam identifikasi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default EnhancedSpeciesAnalysis;
