
import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Calendar, Users, Quote } from 'lucide-react';
import { weatherReferences, type WeatherReference } from '@/utils/weather-explanations';

interface WeatherReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceIds: string[];
  parameterName: string;
}

export const WeatherReferencesModal = ({
  isOpen,
  onClose,
  referenceIds,
  parameterName
}: WeatherReferencesModalProps) => {
  // Map parameter labels to keys
  const getParameterKey = (parameterName: string) => {
    const labelMap: Record<string, string> = {
      'Suhu': 'suhu',
      'Kelembaban': 'kelembaban', 
      'Angin': 'angin',
      'Tekanan': 'tekanan',
      'Kondisi': 'kondisi'
    };
    return labelMap[parameterName] || parameterName.toLowerCase();
  };

  // Get all references for the parameter
  const parameterKey = getParameterKey(parameterName);
  const allReferences = weatherReferences[parameterKey] || [];
  
  // Filter references based on provided IDs
  const displayReferences = referenceIds.length > 0 
    ? allReferences.filter(ref => referenceIds.includes(ref.id))
    : allReferences;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Referensi Jurnal Ilmiah - {parameterName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500">
            <strong>Dasar Ilmiah:</strong> Berikut adalah referensi jurnal penelitian yang mendukung analisis parameter {parameterName.toLowerCase()} untuk aktivitas perikanan:
          </div>
          
          {displayReferences.length > 0 ? (
            <div className="space-y-4">
              {displayReferences.map((reference, index) => (
                <motion.div
                  key={reference.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header with title and badges */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
                        {reference.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{reference.authors}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {reference.year}
                          </Badge>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {reference.journal}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quote section if available */}
                    {reference.quote && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border-l-4 border-blue-400">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                              Kutipan Penelitian:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                              "{reference.quote}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action button */}
                    {reference.url && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(reference.url, '_blank')}
                          className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Buka Jurnal
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Tidak Ada Referensi</h3>
              <p className="text-sm">Referensi jurnal untuk parameter ini sedang dalam proses pengumpulan.</p>
            </div>
          )}
          
          <div className="border-t pt-4 mt-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong>Catatan Metodologi:</strong> Referensi jurnal ini telah dikurasi dari berbagai publikasi penelitian perikanan dan oseanografi Indonesia serta internasional. Setiap parameter dianalisis berdasarkan bukti ilmiah untuk memberikan rekomendasi yang akurat dalam konteks aktivitas perikanan tropis.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
