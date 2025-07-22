
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Search, Plus, Filter, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface KeyboardShortcut {
  key: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

interface KeyboardShortcutsPanelProps {
  onSearchFocus: () => void;
  onFilterToggle: () => void;
  onExport: () => void;
  onAddContent: () => void;
  onSettings: () => void;
}

const KeyboardShortcutsPanel = ({
  onSearchFocus,
  onFilterToggle,
  onExport,
  onAddContent,
  onSettings
}: KeyboardShortcutsPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Ctrl + K',
      description: 'Fokus ke search',
      icon: <Search className="w-4 h-4" />,
      action: onSearchFocus
    },
    {
      key: 'Ctrl + N',
      description: 'Tambah konten baru',
      icon: <Plus className="w-4 h-4" />,
      action: onAddContent
    },
    {
      key: 'Ctrl + F',
      description: 'Toggle filter',
      icon: <Filter className="w-4 h-4" />,
      action: onFilterToggle
    },
    {
      key: 'Ctrl + E',
      description: 'Export data',
      icon: <Download className="w-4 h-4" />,
      action: onExport
    },
    {
      key: 'Ctrl + ,',
      description: 'Buka pengaturan',
      icon: <Settings className="w-4 h-4" />,
      action: onSettings
    },
    {
      key: '?',
      description: 'Tampilkan shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => setIsVisible(!isVisible)
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys);
      
      if (e.ctrlKey) newPressedKeys.add('Ctrl');
      if (e.shiftKey) newPressedKeys.add('Shift');
      if (e.altKey) newPressedKeys.add('Alt');
      newPressedKeys.add(e.key.toLowerCase());
      
      setPressedKeys(newPressedKeys);

      // Handle shortcuts
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        onSearchFocus();
      } else if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        onAddContent();
      } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        onFilterToggle();
      } else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        onExport();
      } else if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        onSettings();
      } else if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      } else if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys);
      
      if (!e.ctrlKey) newPressedKeys.delete('Ctrl');
      if (!e.shiftKey) newPressedKeys.delete('Shift');
      if (!e.altKey) newPressedKeys.delete('Alt');
      newPressedKeys.delete(e.key.toLowerCase());
      
      setPressedKeys(newPressedKeys);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys, isVisible, onSearchFocus, onFilterToggle, onExport, onAddContent, onSettings]);

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsVisible(true)}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 shadow-lg"
        >
          <Keyboard className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Shortcuts Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Keyboard className="w-6 h-6 text-cyan-400" />
                  Keyboard Shortcuts
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">
                        {shortcut.icon}
                      </div>
                      <span className="text-white/90">{shortcut.description}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-white/20 text-white/80 bg-white/10 font-mono text-xs"
                    >
                      {shortcut.key}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <p className="text-cyan-300 text-sm text-center">
                  💡 Tip: Press <Badge className="mx-1 bg-cyan-500/20 text-cyan-300">?</Badge> anytime to show shortcuts
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Keys Display */}
      {pressedKeys.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-6 z-40"
        >
          <div className="bg-black/80 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20">
            <div className="flex gap-1">
              {Array.from(pressedKeys).map((key) => (
                <Badge key={key} className="bg-white/20 text-white text-xs font-mono">
                  {key === ' ' ? 'Space' : key}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default KeyboardShortcutsPanel;
