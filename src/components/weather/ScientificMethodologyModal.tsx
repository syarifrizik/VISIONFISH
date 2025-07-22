
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
import { 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink,
  Calculator,
  BarChart3,
  Users
} from 'lucide-react';
import { 
  fishingScientificReferences, 
  researchBasedWeights, 
  methodologyExplanation 
} from '@/utils/scientific-references';

interface ScientificMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificMethodologyModal = ({
  isOpen,
  onClose
}: ScientificMethodologyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Metodologi Ilmiah: Indeks Kondisi Perikanan Berbasis Riset
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {methodologyExplanation.title}
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              {methodologyExplanation.overview}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {methodologyExplanation.weightingRationale}
            </p>
          </div>

          {/* Research-Based Weights */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              Bobot Parameter Berdasarkan Penelitian
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(researchBasedWeights).map(([param, weight]) => {
                const percentage = Math.round(weight * 100);
                return (
                  <motion.div
                    key={param}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">
                        {param.replace(/([A-Z])/g, ' $1').replace('Of', 'of')}
                      </span>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scientific References */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Referensi Jurnal Ilmiah ({fishingScientificReferences.length} Studi)
            </h4>
            
            <div className="space-y-4">
              {fishingScientificReferences.map((reference, index) => (
                <motion.div
                  key={reference.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80"
                >
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {reference.title}
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{reference.authors}</span>
                        <Badge variant="outline">{reference.year}</Badge>
                        <span className="text-blue-600 dark:text-blue-400">{reference.journal}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {reference.abstract}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Key Findings:</p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {reference.keyFindings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {reference.weightingJustification && (
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          <strong>Justifikasi Bobot:</strong> {reference.weightingJustification}
                        </p>
                      </div>
                    )}
                    
                    {reference.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(reference.url, '_blank')}
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Akses Jurnal
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Limitations & Future Work */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                Keterbatasan Metodologi
              </h4>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  {methodologyExplanation.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">⚠</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
                <BarChart3 className="w-5 h-5" />
                Pengembangan Mendatang
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  {methodologyExplanation.futureWork.map((work, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">🔬</span>
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Citation Note */}
          <div className="border-t pt-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong>Catatan Sitasi:</strong> Penggunaan sistem scoring ini dalam publikasi ilmiah atau komersial mohon mencantumkan rujukan ke VisionFish AI dan penelitian-penelitian yang mendasarinya. Metodologi ini merupakan interpretasi dari literature review dan dapat berbeda dengan implementasi scoring system lainnya.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
