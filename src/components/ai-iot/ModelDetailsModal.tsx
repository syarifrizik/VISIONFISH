
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Check, Zap, Brain, Target, BarChart3, Globe, Microscope, TrendingUp } from "lucide-react";
import { AI_MODEL, AI_MODELS } from "@/utils/ai-models";
import { isPremiumUser } from "@/utils/premiumCheck";
import { cn } from "@/lib/utils";

interface ModelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: AI_MODEL;
  onSelectModel: (modelId: AI_MODEL) => void;
}

const modelDetails = {
  [AI_MODELS.NEPTUNE_FLOW]: {
    name: "Neptune Flow",
    subtitle: "Model Standar",
    description: "Model AI yang handal untuk konsultasi perikanan sehari-hari dengan fokus pada solusi praktis dan rekomendasi yang mudah diterapkan.",
    features: [
      "Identifikasi 500+ spesies ikan Indonesia",
      "Analisis kesegaran berdasarkan standar SNI",
      "Rekomendasi praktis budidaya dan perawatan",
      "Tips perikanan untuk pemula hingga menengah",
      "Konsultasi kualitas air dasar",
      "Panduan perawatan kolam sederhana",
      "Response time cepat dan efisien"
    ],
    useCases: [
      "Nelayan tradisional dan pemula",
      "Hobbyist budidaya ikan hias",
      "Konsultasi perikanan sehari-hari",
      "Identifikasi spesies untuk edukasi",
      "Tips perawatan kolam rumahan",
      "Analisis kesegaran untuk konsumen"
    ],
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-cyan-500 to-teal-500",
    isPremium: false
  },
  [AI_MODELS.CORAL_WAVE]: {
    name: "Coral Wave",
    subtitle: "Model Premium",
    description: "Model AI premium dengan kemampuan analisis mendalam, terminologi ilmiah, dan database spesies yang diperluas untuk profesional perikanan.",
    features: [
      "Database 1000+ spesies laut Indonesia",
      "Analisis morfologi dan anatomi detail",
      "Terminologi ilmiah dan klasifikasi taksonomi",
      "Diagnosis penyakit dan parasit ikan",
      "Rekomendasi nutrisi spesifik spesies",
      "Analisis habitat dan distribusi geografis",
      "Insight berbasis riset dan jurnal terkini",
      "Formulasi pakan berdasarkan kebutuhan spesies"
    ],
    useCases: [
      "Marine biologist dan peneliti",
      "Konsultan perikanan profesional",
      "Budidaya komersial skala menengah-besar",
      "Institusi pendidikan perikanan",
      "Laboratorium analisis ikan",
      "Pengembangan produk akuakultur",
      "Penelitian ekologi perairan"
    ],
    icon: <Brain className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    isPremium: true
  },
  [AI_MODELS.REGAL_TIDE]: {
    name: "Regal Tide",
    subtitle: "Model Elite",
    description: "Model AI tercanggih dengan kemampuan business intelligence, market analysis, dan strategic consulting untuk enterprise perikanan tingkat global.",
    features: [
      "Full database marine species global",
      "Market analysis dan pricing trends",
      "Business intelligence untuk perikanan",
      "Supply chain optimization strategy",
      "Competitive analysis dan market entry",
      "ROI calculation dan investment planning",
      "Strategic consulting untuk enterprise",
      "Integration planning IoT dan automation",
      "Export-import market intelligence"
    ],
    useCases: [
      "CEO dan strategic decision maker",
      "Investment analyst perikanan",
      "Enterprise perikanan skala besar",
      "Konsultan bisnis marine industry",
      "Market research dan competitive intelligence",
      "Perencanaan ekspansi bisnis perikanan",
      "Startup perikanan dengan fokus teknologi"
    ],
    icon: <TrendingUp className="h-6 w-6" />,
    gradient: "from-blue-500 to-indigo-500",
    isPremium: true
  }
};

export const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({
  isOpen,
  onClose,
  modelId,
  onSelectModel
}) => {
  const model = modelDetails[modelId];
  const isUserPremium = isPremiumUser();
  const canUseModel = !model.isPremium || isUserPremium;

  const handleSelectModel = () => {
    if (canUseModel) {
      onSelectModel(modelId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-r text-white",
              model.gradient
            )}>
              {model.icon}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {model.name}
                {model.isPremium && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </DialogTitle>
              <Badge variant="secondary" className="mt-1">
                {model.subtitle}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {model.description}
          </p>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Fitur Unggulan
              </h3>
              <ul className="space-y-2">
                {model.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Cocok Untuk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {model.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {useCase}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {!canUseModel && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Upgrade ke Premium</h3>
                <p className="text-muted-foreground mb-4">
                  Model ini hanya tersedia untuk pengguna Premium. Upgrade sekarang untuk mengakses seluruh fitur canggih.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSelectModel}
              disabled={!canUseModel}
              className={cn(
                "flex-1",
                canUseModel 
                  ? `bg-gradient-to-r ${model.gradient} hover:opacity-90 text-white`
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {canUseModel ? "Gunakan Model Ini" : "Perlu Premium"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
