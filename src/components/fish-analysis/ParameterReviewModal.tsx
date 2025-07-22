
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FishParameter } from '@/utils/fish-analysis';
import { Activity, AlertCircle, CheckCircle, Fish } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParameterReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parameters: FishParameter;
  fishName: string;
  onConfirm: () => void;
}

const getValueDescription = (value: number): { label: string; color: string; icon: React.ReactNode } => {
  if (value === 9) return { 
    label: "Sangat Baik", 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: <CheckCircle className="w-3 h-3" />
  };
  if (value >= 7 && value <= 8) return { 
    label: "Baik", 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="w-3 h-3" />
  };
  if (value >= 5 && value <= 6) return { 
    label: "Sedang", 
    color: "bg-amber-100 text-amber-800 border-amber-200", 
    icon: <AlertCircle className="w-3 h-3" />
  };
  if (value >= 1 && value <= 3) return { 
    label: "Busuk", 
    color: "bg-red-100 text-red-800 border-red-200", 
    icon: <AlertCircle className="w-3 h-3" />
  };
  return { 
    label: "Tidak Valid", 
    color: "bg-gray-100 text-gray-600 border-gray-200", 
    icon: <AlertCircle className="w-3 h-3" />
  };
};

const ParameterReviewModal: React.FC<ParameterReviewModalProps> = ({
  open,
  onOpenChange,
  parameters,
  fishName,
  onConfirm,
}) => {
  const avgScore = Object.values(parameters).reduce((sum, val) => sum + val, 0) / Object.values(parameters).length;
  const validParams = Object.entries(parameters).filter(([_, value]) => value !== 4);
  const invalidParams = Object.entries(parameters).filter(([_, value]) => value === 4);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-visionfish-neon-blue" />
            Review Parameter Analisis
          </DialogTitle>
          <DialogDescription>
            Periksa kembali parameter yang telah Anda input sebelum melakukan analisis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fish Name */}
          <div className="p-4 bg-visionfish-neon-blue/5 rounded-lg border border-visionfish-neon-blue/10">
            <div className="text-sm font-medium text-muted-foreground">Jenis Ikan</div>
            <div className="text-lg font-semibold">{fishName || "Tidak Diketahui"}</div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-visionfish-neon-blue">{avgScore.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Rata-rata Skor</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{validParams.length}</div>
              <div className="text-sm text-muted-foreground">Parameter Valid</div>
            </div>
          </div>

          {/* Valid Parameters */}
          {validParams.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Parameter Valid</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {validParams.map(([name, value]) => {
                  const desc = getValueDescription(value);
                  return (
                    <motion.div
                      key={name}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{name}</span>
                        <Badge variant="outline" className={desc.color}>
                          {desc.icon}
                          {desc.label}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-visionfish-neon-blue">{value}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Invalid Parameters Warning */}
          {invalidParams.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800">Parameter Diabaikan</span>
              </div>
              <div className="text-sm text-amber-700 mb-2">
                Parameter berikut memiliki nilai 4 (tidak valid dalam standar SNI) dan akan diabaikan dalam perhitungan:
              </div>
              <div className="flex flex-wrap gap-2">
                {invalidParams.map(([name]) => (
                  <Badge key={name} variant="outline" className="bg-gray-100 text-gray-600">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Kembali Edit
          </Button>
          <Button 
            onClick={onConfirm}
            className="w-full sm:w-auto bg-visionfish-neon-blue hover:bg-visionfish-neon-blue/90"
          >
            <Activity className="w-4 h-4 mr-2" />
            Lanjutkan Analisis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParameterReviewModal;
