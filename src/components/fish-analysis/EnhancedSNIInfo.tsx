import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
interface QualityLevel {
  score: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  characteristics: string[];
  actionAdvice: string;
}
const qualityLevels: QualityLevel[] = [{
  score: '9',
  label: 'Prima',
  color: 'text-blue-700 bg-blue-100 border-blue-200',
  icon: <CheckCircle className="w-4 h-4" />,
  description: 'Ikan dalam kondisi sangat segar dan berkualitas tinggi',
  characteristics: ['Mata jernih dan cembung', 'Insang merah cerah tanpa lendir', 'Daging elastis dan padat', 'Bau segar khas ikan'],
  actionAdvice: 'Ikan dengan kualitas prima dapat langsung dikonsumsi atau diolah dengan berbagai cara.'
}, {
  score: '7-8',
  label: 'Baik',
  color: 'text-green-700 bg-green-100 border-green-200',
  icon: <CheckCircle className="w-4 h-4" />,
  description: 'Ikan masih segar dan layak konsumsi',
  characteristics: ['Mata agak keruh tapi masih cembung', 'Insang merah muda dengan sedikit lendir', 'Daging masih elastis', 'Bau masih segar'],
  actionAdvice: 'Ikan berkualitas baik sebaiknya segera diolah atau disimpan dengan es.'
}, {
  score: '5-6',
  label: 'Sedang',
  color: 'text-amber-700 bg-amber-100 border-amber-200',
  icon: <AlertTriangle className="w-4 h-4" />,
  description: 'Ikan mulai menurun kualitasnya, perlu perhatian khusus',
  characteristics: ['Mata keruh dan mulai cekung', 'Insang kemerahan dengan lendir', 'Daging mulai lembek', 'Bau mulai tidak segar'],
  actionAdvice: 'Sebaiknya segera diolah dengan panas tinggi atau diawetkan.'
}, {
  score: '1-3',
  label: 'Busuk',
  color: 'text-red-700 bg-red-100 border-red-200',
  icon: <XCircle className="w-4 h-4" />,
  description: 'Ikan sudah tidak layak konsumsi',
  characteristics: ['Mata keruh dan cekung', 'Insang kecoklatan dengan lendir banyak', 'Daging lembek dan mudah hancur', 'Bau busuk dan menyengat'],
  actionAdvice: 'JANGAN dikonsumsi. Buang ikan ini untuk menghindari risiko kesehatan.'
}];
const parameters = [{
  name: 'Mata',
  fresh: 'Kornea jernih, pupil hitam, bola mata cembung',
  deteriorating: 'Kornea agak keruh, pupil keabu-abuan, bola mata agak cembung',
  spoiled: 'Kornea keruh, pupil putih keabu-abuan, bola mata cekung'
}, {
  name: 'Insang',
  fresh: 'Warna merah cerah, tanpa lendir, bau segar',
  deteriorating: 'Warna merah muda, sedikit lendir, bau agak amis',
  spoiled: 'Warna coklat kehijauan, berlendir, bau busuk'
}, {
  name: 'Lendir',
  fresh: 'Lapisan lendir transparan, jernih, mengkilap',
  deteriorating: 'Lendir agak keruh, mulai lengket',
  spoiled: 'Lendir keruh, tebal, tidak mengkilap'
}, {
  name: 'Daging',
  fresh: 'Warna cemerlang spesifik, tekstur padat elastis',
  deteriorating: 'Warna mulai pudar, tekstur agak lembek',
  spoiled: 'Warna kusam, tekstur lembek mudah hancur'
}, {
  name: 'Bau',
  fresh: 'Segar, khas ikan, tanpa bau asing',
  deteriorating: 'Mulai amis, tidak menyengat',
  spoiled: 'Busuk, menyengat, tidak sedap'
}, {
  name: 'Tekstur',
  fresh: 'Padat, kenyal, elastis saat ditekan',
  deteriorating: 'Agak lembek, kurang elastis',
  spoiled: 'Lembek, mudah hancur, tidak elastis'
}];
const EnhancedSNIInfo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  return <div className="space-y-4">
      {/* Main SNI Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <BookOpen className="w-5 h-5" />
            Standar SNI 2729-2013 - Ikan Segar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Sistem penilaian menggunakan skala 1-9 berdasarkan Standar Nasional Indonesia untuk ikan segar.
            <strong className="block mt-1">Nilai 4 tidak termasuk dalam standar SNI.</strong>
          </p>

          {/* Quality Levels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {qualityLevels.map(level => <div key={level.score} className={`p-3 rounded-lg border text-center ${level.color}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {level.icon}
                  <span className="font-semibold text-sm">{level.label}</span>
                </div>
                <div className="text-xs font-medium">{level.score}</div>
              </div>)}
          </div>

          {/* Expandable Detailed Info */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                <span className="text-sm">Panduan Lengkap Parameter</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {/* Parameter Guide */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Parameter Penilaian:</h4>
                <div className="grid gap-2">
                  {parameters.map(param => <Card key={param.name} className={`cursor-pointer transition-all duration-200 ${selectedParameter === param.name ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-sm'}`} onClick={() => setSelectedParameter(selectedParameter === param.name ? null : param.name)}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{param.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${selectedParameter === param.name ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <AnimatePresence>
                          {selectedParameter === param.name && <motion.div initial={{
                        opacity: 0,
                        height: 0
                      }} animate={{
                        opacity: 1,
                        height: 'auto'
                      }} exit={{
                        opacity: 0,
                        height: 0
                      }} transition={{
                        duration: 0.2
                      }} className="mt-3 space-y-2">
                              <div>
                                <Badge className="bg-green-100 text-green-800 mb-1">Segar (7-9)</Badge>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{param.fresh}</p>
                              </div>
                              <div>
                                <Badge className="bg-amber-100 text-amber-800 mb-1">Menurun (5-6)</Badge>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{param.deteriorating}</p>
                              </div>
                              <div>
                                <Badge className="bg-red-100 text-red-800 mb-1">Busuk (1-4)</Badge>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{param.spoiled}</p>
                              </div>
                            </motion.div>}
                        </AnimatePresence>
                      </CardContent>
                    </Card>)}
                </div>
              </div>

              {/* Quality Level Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Panduan Tindakan:</h4>
                <div className="space-y-2">
                  {qualityLevels.map(level => <div key={level.score} className={`p-3 rounded-lg border ${level.color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {level.icon}
                        <span className="font-medium text-sm">{level.label} ({level.score})</span>
                      </div>
                      <p className="text-xs mb-2">{level.description}</p>
                      <p className="text-xs font-medium">{level.actionAdvice}</p>
                    </div>)}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Tips Praktis:</p>
              <ul className="text-xs space-y-1">
                <li>• Periksa mata dan insang terlebih dahulu</li>
                <li>• Tekan daging untuk menguji elastisitas</li>
                <li>• Bau adalah indikator penting kesegaran</li>
                <li>• Hindari ikan dengan nilai 4 (tidak sesuai SNI)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default EnhancedSNIInfo;