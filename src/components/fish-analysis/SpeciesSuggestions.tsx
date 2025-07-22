
import { History, Star, Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SpeciesSuggestionsProps {
  recentSpecies: string[];
  popularSpecies: string[];
  filteredSuggestions: string[];
  searchValue: string;
  showHistoryOnEnter: boolean;
  onSpeciesSelect: (species: string) => void;
}

const SpeciesSuggestions = ({ 
  recentSpecies, 
  popularSpecies, 
  filteredSuggestions, 
  searchValue, 
  showHistoryOnEnter,
  onSpeciesSelect 
}: SpeciesSuggestionsProps) => {
  // Show history when Enter is pressed or when there's no search value
  const shouldShowHistory = showHistoryOnEnter || !searchValue.trim();
  
  return (
    <div className="space-y-4">
      {/* Recent Species - Show with horizontal scroll */}
      {shouldShowHistory && recentSpecies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Terakhir Digunakan</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-visionfish-neon-blue/20 scrollbar-track-transparent">
            <div className="flex gap-2 min-w-max">
              {recentSpecies.map((species) => (
                <Badge
                  key={species}
                  variant="secondary"
                  className="cursor-pointer hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  onClick={() => onSpeciesSelect(species)}
                >
                  <Fish className="w-3 h-3" />
                  {species}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Species - Show with horizontal scroll */}
      {shouldShowHistory && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Jenis Populer</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-visionfish-neon-blue/20 scrollbar-track-transparent">
            <div className="flex gap-2 min-w-max">
              {popularSpecies.slice(0, 10).map((species) => (
                <Badge
                  key={species}
                  variant="outline"
                  className="cursor-pointer hover:bg-visionfish-neon-blue/10 hover:border-visionfish-neon-blue hover:text-visionfish-neon-blue transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  onClick={() => onSpeciesSelect(species)}
                >
                  <Fish className="w-3 h-3" />
                  {species}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtered Suggestions - Show when typing */}
      <AnimatePresence>
        {filteredSuggestions.length > 0 && searchValue.trim() && !showHistoryOnEnter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-3"
          >
            <span className="text-sm font-medium text-muted-foreground mb-3 block">
              Saran untuk "{searchValue}"
            </span>
            <div className="space-y-1">
              {filteredSuggestions.map((species) => (
                <Button
                  key={species}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue"
                  onClick={() => onSpeciesSelect(species)}
                >
                  <Fish className="w-4 h-4 mr-2" />
                  {species}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful message when Enter is pressed */}
      {showHistoryOnEnter && recentSpecies.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat pencarian. Mulai ketik untuk melihat saran jenis ikan.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpeciesSuggestions;
