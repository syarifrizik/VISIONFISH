
export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  fish_caught?: number;
  followers_count?: number;
  following_count?: number;
  is_private?: boolean;
  is_online?: boolean;
  last_seen_at?: string;
  privacy_settings?: {
    bio_visibility: string;
    photo_visibility: string;
    stats_visibility: string;
    profile_visibility: string;
  };
}

export interface ProfileStats {
  total_posts: number;
  total_catches: number;
  following_count: number;
  followers_count: number;
}

export interface ProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile?: boolean;
  isPremium?: boolean;
  onStatsUpdate?: (newStats: ProfileStats) => void;
}

export interface StatItem {
  key: string;
  label: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  editable?: boolean;
  ariaLabel: string;
}
