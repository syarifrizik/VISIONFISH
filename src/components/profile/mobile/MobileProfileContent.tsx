
import { motion } from 'framer-motion';
import { UserProfile } from '@/types/profile';

interface MobileProfileContentProps {
  activeTab: string;
  user: UserProfile;
}

const MobileProfileContent = ({
  activeTab,
  user
}: MobileProfileContentProps) => {
  const getTabContent = () => {
    switch (activeTab) {
      case 'aktivitas':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🎣</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aktivitas Memancing</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Tangkapan ikan terbaru, lokasi favorit, dan pencapaian memancing Anda.
            </p>
          </div>
        );
      case 'catatan':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Catatan Pribadi</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Jurnal harian, tips memancing, dan catatan pengalaman pribadi.
            </p>
          </div>
        );
      case 'komunitas':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Komunitas</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Chat dengan pemancing lain dan dapatkan promosi eksklusif.
            </p>
          </div>
        );
      case 'riwayat':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Riwayat</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Statistik memancing dan analisis performa harian.
            </p>
          </div>
        );
      case 'pengguna':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pengguna</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Temukan dan ikuti pemancing lain di komunitas.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      {getTabContent()}
    </div>
  );
};

export default MobileProfileContent;
