import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings, Share2, Search, Bell, Menu, Plus } from 'lucide-react';
interface OptimizedMobileHeaderProps {
  title: string;
  onSearch?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  onNotifications?: () => void;
  onAdd?: () => void;
  showAddButton?: boolean;
}
const OptimizedMobileHeader = ({
  title,
  onSearch,
  onSettings,
  onShare,
  onNotifications,
  onAdd,
  showAddButton = false
}: OptimizedMobileHeaderProps) => {
  return <motion.div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }}>
      
    </motion.div>;
};
export default OptimizedMobileHeader;