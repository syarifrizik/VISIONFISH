
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
  isNotFound?: boolean;
}

const ProfileErrorState = ({ error, onRetry, isNotFound = false }: ProfileErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50/98 via-blue-50/95 to-purple-50/98 dark:from-gray-950/98 dark:via-blue-950/95 dark:to-purple-950/98">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
                      isNotFound 
                        ? 'bg-orange-100 dark:bg-orange-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <AlertCircle className={`w-8 h-8 ${
                      isNotFound ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                    }`} />
                  </motion.div>

                  <motion.h2 
                    className={`text-xl font-bold mb-3 ${
                      isNotFound 
                        ? 'text-orange-800 dark:text-orange-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isNotFound ? 'Profil Tidak Ditemukan' : 'Terjadi Kesalahan'}
                  </motion.h2>

                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {error}
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      onClick={onRetry}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Coba Lagi
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Kembali ke Beranda
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileErrorState;
