
import { useState, useEffect, useRef } from "react";
import { POPULAR_FISH_SPECIES } from "@/components/fish-analysis/fishSpeciesConstants";

interface UseFishSpeciesSelectionProps {
  value: string;
  onChange: (value: string) => void;
  recentSpecies: string[];
  onSpeciesSelect: (species: string) => void;
}

export const useFishSpeciesSelection = ({
  value,
  onChange,
  recentSpecies,
  onSpeciesSelect
}: UseFishSpeciesSelectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showHistoryOnEnter, setShowHistoryOnEnter] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout>();

  // Filter suggestions based on input value
  useEffect(() => {
    if (value.trim()) {
      const combined = [...new Set([...recentSpecies, ...POPULAR_FISH_SPECIES])];
      const filtered = combined.filter(species => 
        species.toLowerCase().includes(value.toLowerCase()) && species !== value
      );
      setFilteredSuggestions(filtered.slice(0, 8));
      console.log('Filtered suggestions:', filtered.slice(0, 8));
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, recentSpecies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    onChange(newValue);
    setShowHistoryOnEnter(false);
    
    // Show popover when typing
    if (newValue.trim()) {
      setIsOpen(true);
    } else if (recentSpecies.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    console.log('Input focused');
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    // Show popover when focused
    if (value.trim() || recentSpecies.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    console.log('Input blurred');
    // Delay closing the popover to allow for suggestion clicks
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setShowHistoryOnEnter(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed, showing history');
      setShowHistoryOnEnter(true);
      setIsOpen(true);
    }
  };

  const handleSpeciesSelect = async (species: string) => {
    console.log('Species selected:', species);
    
    try {
      onChange(species);
      setIsOpen(false);
      setShowHistoryOnEnter(false);
      
      // Focus the input after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      onSpeciesSelect(species);
    } catch (error) {
      console.error('Error handling species selection:', error);
    }
  };

  const clearInput = () => {
    console.log('Clearing input');
    onChange("");
    setIsOpen(false);
    setShowHistoryOnEnter(false);
    
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    filteredSuggestions,
    showHistoryOnEnter,
    inputRef,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    handleSpeciesSelect,
    clearInput
  };
};
