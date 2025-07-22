
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart, Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SimpleCommunityFallback = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const mockPosts = [
    {
      id: '1',
      author: 'Pemancing Jakarta',
      content: 'Spot mancing terbaik di Pantai Anyer pagi ini! Dapat beberapa ikan kakap yang lumayan.',
      timestamp: '2 jam lalu',
      likes: 24,
      views: 150
    },
    {
      id: '2', 
      author: 'Master Casting',
      content: 'Tips teknik casting untuk pemula - pastikan timing yang tepat saat melempar.',
      timestamp: '4 jam lalu',
      likes: 18,
      views: 89
    }
  ];

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Komunitas Memancing
        </h2>
        <p className="text-white/70 mb-4">
          Mode darurat - konten terbatas tersedia
        </p>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Memuat...' : 'Muat Ulang Komunitas'}
        </Button>
      </div>

      {/* Mock Posts */}
      <div className="px-6 space-y-4">
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{post.author}</h4>
                    <span className="text-white/60 text-sm">{post.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-white/90 mb-4">{post.content}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-white/70">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{post.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notice */}
      <div className="px-6">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-100 text-sm">
              Ini adalah mode darurat komunitas. Silakan muat ulang untuk mengakses fitur lengkap.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleCommunityFallback;
