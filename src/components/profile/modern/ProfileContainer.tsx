
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ProfileContainerProps {
  children: ReactNode;
  className?: string;
}

const ProfileContainer = ({ children, className = "" }: ProfileContainerProps) => {
  return (
    <motion.div 
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.03)_25%,transparent_25%),linear-gradient(-45deg,rgba(168,85,247,0.03)_25%,transparent_25%)]" style={{ backgroundSize: '60px 60px' }} />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default ProfileContainer;
