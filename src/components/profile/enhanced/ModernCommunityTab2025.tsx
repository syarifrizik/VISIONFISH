import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, RotateCcw, Bookmark, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import CommunityErrorBoundary from '@/components/community/CommunityErrorBoundary';
import FastCommunityLoader from '@/components/community/FastCommunityLoader';
import MobileCommunityHeader from '@/components/community/MobileCommunityHeader';
import MobileTabNavigation from '@/components/community/MobileTabNavigation';
import MobileStatsGrid from '@/components/community/MobileStatsGrid';

// Lazy load components
const ModernMasonry = React.lazy(() => {
  const componentImport = import('@/components/community/ModernMasonry');
  setTimeout(() => componentImport, 100);
  return componentImport;
});

const CommunityListView = React.lazy(() => {
  const componentImport = import('@/components/community/CommunityListView');
  setTimeout(() => componentImport, 100);
  return componentImport;
});

const CreatePostModal = React.lazy(() => {
  const componentImport = import('@/components/community/CreatePostModal');
  setTimeout(() => componentImport, 200);
  return componentImport;
});

const SavedPostsTab = React.lazy(() => {
  const componentImport = import('@/components/community/SavedPostsTab');
  setTimeout(() => componentImport, 200);
  return componentImport;
});

const ModernCommunityTab2025 = () => {
  console.log('ModernCommunityTab2025 rendering...');
  
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [refreshKey, setRefreshKey] = useState(0);

  // Use optimized hook
  const { posts, isLoading, toggleLike, refetch } = useCommunityPosts();

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1);
    await refetch();
  };

  const handlePostCreated = () => {
    handleRefresh();
  };

  if (isLoading) {
    return <FastCommunityLoader />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <CommunityErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          {/* Mobile Header */}
          <MobileCommunityHeader
            onRefresh={handleRefresh}
            onCreatePost={() => setShowCreateModal(true)}
            onSearch={() => {}}
            onFilter={() => {}}
          />

          {/* Mobile Tab Navigation */}
          {user && (
            <MobileTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              postsCount={posts?.length || 0}
              savedCount={0}
            />
          )}

          {/* Mobile Stats Grid */}
          {activeTab === 'posts' && (
            <MobileStatsGrid
              totalPosts={posts?.length || 0}
              totalLikes={posts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0}
              totalViews={posts?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0}
              totalComments={0}
            />
          )}

          {/* Mobile Content */}
          <div className="px-4 pb-20">
            <Suspense fallback={<FastCommunityLoader />}>
              {activeTab === 'posts' ? (
                viewMode === 'grid' ? (
                  <ModernMasonry
                    posts={posts || []}
                    onLike={toggleLike}
                    currentUserId={user?.id}
                    onRefresh={handleRefresh}
                    key={refreshKey}
                  />
                ) : (
                  <CommunityListView
                    posts={posts || []}
                    onLike={toggleLike}
                    currentUserId={user?.id}
                    onRefresh={handleRefresh}
                    key={refreshKey}
                  />
                )
              ) : (
                <SavedPostsTab />
              )}
            </Suspense>
          </div>

          {/* Create Post Modal */}
          {showCreateModal && (
            <Suspense fallback={null}>
              <CreatePostModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onPostCreated={handlePostCreated}
              />
            </Suspense>
          )}
        </div>
      </CommunityErrorBoundary>
    );
  }

  // Desktop Layout
  return (
    <CommunityErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Modern Header with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Komunitas Memancing
              </h1>
              <p className="text-white/70 text-lg">
                Berbagi pengalaman dan tips memancing dengan sesama angler
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-3"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
              
              {user && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8 py-3 text-lg font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Post
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation with Modern Design */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-8 py-6"
          >
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 w-fit">
              <Button
                variant={activeTab === 'posts' ? 'default' : 'ghost'}
                size="lg"
                onClick={() => setActiveTab('posts')}
                className={`transition-all duration-300 rounded-xl px-8 py-3 ${
                  activeTab === 'posts'
                    ? 'bg-white text-black hover:bg-white/90 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Semua Post
              </Button>
              <Button
                variant={activeTab === 'saved' ? 'default' : 'ghost'}
                size="lg"
                onClick={() => setActiveTab('saved')}
                className={`transition-all duration-300 rounded-xl px-8 py-3 ${
                  activeTab === 'saved'
                    ? 'bg-white text-black hover:bg-white/90 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Bookmark className="w-5 h-5 mr-2" />
                Saved Posts
              </Button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats Grid */}
        {activeTab === 'posts' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-8 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-white/70 text-sm font-semibold">Total Posts</span>
                </div>
                <p className="text-2xl font-bold text-white">{posts?.length || 0}</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-white/70 text-sm font-semibold">Total Likes</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {posts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0}
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-white/70 text-sm font-semibold">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {posts?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-white/70 text-sm font-semibold">Community</span>
                </div>
                <p className="text-2xl font-bold text-white">Active</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-8 pb-16"
        >
          <Suspense fallback={<FastCommunityLoader />}>
            {activeTab === 'posts' ? (
              viewMode === 'grid' ? (
                <ModernMasonry
                  posts={posts || []}
                  onLike={toggleLike}
                  currentUserId={user?.id}
                  onRefresh={handleRefresh}
                  key={refreshKey}
                />
              ) : (
                <CommunityListView
                  posts={posts || []}
                  onLike={toggleLike}
                  currentUserId={user?.id}
                  onRefresh={handleRefresh}
                  key={refreshKey}
                />
              )
            ) : (
              <SavedPostsTab />
            )}
          </Suspense>
        </motion.div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <Suspense fallback={null}>
            <CreatePostModal
              open={showCreateModal}
              onOpenChange={setShowCreateModal}
              onPostCreated={handlePostCreated}
            />
          </Suspense>
        )}
      </div>
    </CommunityErrorBoundary>
  );
};

export default ModernCommunityTab2025;
