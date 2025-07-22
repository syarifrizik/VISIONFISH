
import { motion } from 'framer-motion';
import { UserProfile } from '@/types/profile';
import ProfileActivityGrid from '../ProfileActivityGrid';
import NotesTab from '../NotesTab';
import ModernCommunityTab2025 from '../enhanced/ModernCommunityTab2025';
import DesktopUserExplorer from './DesktopUserExplorer';

interface DesktopProfileContentProps {
  activeTab: string;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  user: UserProfile;
}

const DesktopProfileContent = ({
  activeTab,
  searchQuery,
  viewMode,
  user
}: DesktopProfileContentProps) => {
  const getTabContent = () => {
    switch (activeTab) {
      case 'aktivitas':
        return (
          <ProfileActivityGrid
            searchQuery={searchQuery}
            viewMode={viewMode}
          />
        );
      case 'catatan':
        return (
          <NotesTab
            searchQuery={searchQuery}
          />
        );
      case 'komunitas':
        return <ModernCommunityTab2025 />;
      case 'pengguna':
        return <DesktopUserExplorer />;
      default:
        return (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6">
              <span className="text-3xl">🎣</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Aktivitas Memancing</h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Riwayat tangkapan ikan, lokasi memancing, dan pencapaian terbaru akan ditampilkan di sini.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10" />
      
      <div className="relative z-10 p-8 min-h-[600px]">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DesktopProfileContent;
