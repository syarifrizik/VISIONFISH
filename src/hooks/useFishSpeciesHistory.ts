
import { useState, useEffect } from "react";
import { fishSpeciesHistoryService } from "@/services/fishSpeciesHistoryService";
import { STORAGE_KEY } from "@/components/fish-analysis/fishSpeciesConstants";

export const useFishSpeciesHistory = () => {
  const [recentSpecies, setRecentSpecies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load recent species from both Supabase and localStorage
  useEffect(() => {
    const loadRecentSpecies = async () => {
      try {
        setIsLoading(true);
        
        // First, try to load from localStorage (always available)
        let localHistory: string[] = [];
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            localHistory = JSON.parse(stored);
            console.log('Loaded history from localStorage:', localHistory);
          }
        } catch (localError) {
          console.error('Error parsing localStorage species:', localError);
        }

        // Then, try to load from Supabase (for logged-in users)
        try {
          const supabaseHistory = await fishSpeciesHistoryService.getHistory();
          if (supabaseHistory.length > 0) {
            // Merge and deduplicate: prioritize Supabase data, then localStorage
            const mergedHistory = [...new Set([...supabaseHistory, ...localHistory])];
            setRecentSpecies(mergedHistory.slice(0, 5));
            console.log('Loaded and merged history from Supabase + localStorage:', mergedHistory.slice(0, 5));
          } else {
            // Use localStorage data if no Supabase data
            setRecentSpecies(localHistory.slice(0, 5));
            console.log('Using localStorage history only:', localHistory.slice(0, 5));
          }
        } catch (supabaseError) {
          // If Supabase fails (user not logged in, etc.), use localStorage
          console.log('Supabase not available, using localStorage history:', localHistory);
          setRecentSpecies(localHistory.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading recent species:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentSpecies();
  }, []);

  const addToHistory = async (species: string) => {
    try {
      // Update localStorage first (always works)
      const updated = [species, ...recentSpecies.filter(s => s !== species)].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentSpecies(updated);
      console.log('Updated localStorage with species:', updated);
      
      // Try to add to Supabase history (for logged-in users)
      try {
        await fishSpeciesHistoryService.addToHistory(species);
        console.log('Successfully added to Supabase history');
      } catch (supabaseError) {
        console.log('Could not add to Supabase (user may not be logged in):', supabaseError);
        // This is fine - localStorage will be our fallback
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  return {
    recentSpecies,
    isLoading,
    addToHistory
  };
};
