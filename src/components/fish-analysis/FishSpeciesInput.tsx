import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface FishSpeciesInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Get recent species from localStorage
const getRecentSpecies = (): string[] => {
  try {
    const stored = localStorage.getItem('visionfish_recent_species');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save to recent species
const saveToRecent = (species: string) => {
  try {
    const recent = getRecentSpecies();
    const updated = [species, ...recent.filter(s => s !== species)].slice(0, 5);
    localStorage.setItem('visionfish_recent_species', JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
};
const FishSpeciesInput = ({
  value,
  onChange,
  className
}: FishSpeciesInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  const handleInputBlur = () => {
    // Save to recent when user finishes typing
    if (value.trim()) {
      saveToRecent(value.trim());
    }
  };
  const clearInput = () => {
    onChange("");
    if (inputRef.current) inputRef.current.focus();
  };
  return <div className={className}>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="relative">
        {/* Modern 2025+ Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-100/40 dark:from-slate-900/90 dark:via-blue-950/60 dark:to-indigo-950/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-blue-500/10 p-8 mb-6">
          {/* Floating gradient orbs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-400/30 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-cyan-400/30 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <Fish className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-700 dark:from-white dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent mb-2">
                  Species Analysis Hub
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Pilih jenis ikan untuk analisis kualitas menggunakan standar SNI</p>
              </div>
            </div>

            {/* Modern Input Section */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-indigo-500/20 rounded-2xl blur-xl group-focus-within:from-violet-500/30 group-focus-within:via-purple-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500"></div>
                
                <div className="relative flex items-center">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                  
                  <Input ref={inputRef} placeholder="Ketik nama ikan (contoh: Nila, Lele, Tongkol)..." value={value} onChange={handleInputChange} onBlur={handleInputBlur} className="h-16 pl-14 pr-14 text-lg rounded-2xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-inner focus:bg-white/90 dark:focus:bg-slate-800/90 focus:ring-2 focus:ring-violet-500/50 transition-all duration-300 placeholder:text-slate-400" autoComplete="off" />
                  
                  {value && <Button variant="ghost" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 z-10" onClick={clearInput} onMouseDown={e => e.preventDefault()}>
                      <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </Button>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Fish Display */}
        {value && <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/20 border border-emerald-200/50 dark:border-emerald-800/30 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Ikan yang dipilih:</p>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{value}</p>
              </div>
            </div>
          </motion.div>}
      </motion.div>
    </div>;
};
export default FishSpeciesInput;