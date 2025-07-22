
import { useState, useEffect, useMemo } from 'react';
import { useCommunityPosts } from './useCommunityPosts';

interface FilterOptions {
  searchQuery: string;
  filterBy: string;
  sortBy: string;
}

export const useEnhancedCommunityPosts = () => {
  const { posts, isLoading, createPost, updatePost, deletePost, toggleLike } = useCommunityPosts();
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    filterBy: 'all',
    sortBy: 'newest'
  });

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.location?.toLowerCase().includes(query) ||
        post.profiles?.display_name?.toLowerCase().includes(query) ||
        post.profiles?.username?.toLowerCase().includes(query)
      );
    }

    // Apply content filter
    switch (filters.filterBy) {
      case 'public':
        filtered = filtered.filter(post => !post.is_private);
        break;
      case 'private':
        filtered = filtered.filter(post => post.is_private);
        break;
      case 'with_images':
        filtered = filtered.filter(post => post.image_url);
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(post => {
          const postDate = new Date(post.created_at);
          postDate.setHours(0, 0, 0, 0);
          return postDate.getTime() === today.getTime();
        });
        break;
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'most_liked':
        filtered.sort((a, b) => b.likes_count - a.likes_count);
        break;
      case 'most_viewed':
        filtered.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'trending':
        // Trending algorithm: likes + views with recency boost
        filtered.sort((a, b) => {
          const aScore = (a.likes_count * 2 + a.views_count) * (1 + (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24));
          const bScore = (b.likes_count * 2 + b.views_count) * (1 + (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24));
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  }, [posts, filters]);

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const updateFilter = (filter: string) => {
    setFilters(prev => ({ ...prev, filterBy: filter }));
  };

  const updateSort = (sort: string) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      filterBy: 'all',
      sortBy: 'newest'
    });
  };

  return {
    posts: filteredAndSortedPosts,
    allPosts: posts,
    isLoading,
    filters,
    updateSearchQuery,
    updateFilter,
    updateSort,
    resetFilters,
    createPost,
    updatePost,
    deletePost,
    toggleLike
  };
};
