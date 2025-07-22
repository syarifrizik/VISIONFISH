
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Camera,
  Settings,
  Share2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileData } from '@/hooks/useProfile';

interface OptimizedProfileHeaderProps {
  profileData: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

const OptimizedProfileHeader = ({
  profileData,
  isEditing,
  onEditToggle,
  onAvatarChange,
  handleInputChange,
  onSave
}: OptimizedProfileHeaderProps) => {
  const { user } = useAuth();
  const [showFullBio, setShowFullBio] = useState(false);

  const quickStats = [
    { label: 'Tangkapan', value: profileData.fish_caught, icon: Award, color: '#A56ABD' },
    { label: 'Rating', value: '4.8', icon: Star, color: '#E7D7EF' },
    { label: 'Followers', value: '1.2K', icon: Users, color: '#6E3482' },
    { label: 'Trending', value: '92%', icon: TrendingUp, color: '#49225B' }
  ];

  return (
    <div className="space-y-4">
      {/* Mobile: Compact Header */}
      <div className="md:hidden">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD] shadow-xl">
          <CardContent className="p-4 text-white">
            {/* Profile Info Row */}
            <div className="flex items-center gap-3 mb-4">
              {/* Avatar */}
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border-2 border-white/30 overflow-hidden"
                >
                  {profileData.avatar_url ? (
                    <img 
                      src={profileData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
                </motion.div>
                {isEditing && (
                  <motion.label
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#A56ABD] rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
                  >
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="hidden"
                    />
                  </motion.label>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      name="display_name"
                      value={profileData.display_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white placeholder-white/70 text-sm"
                      placeholder="Nama Tampilan"
                    />
                    <input
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white placeholder-white/70 text-xs"
                      placeholder="Username"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-lg font-bold text-white truncate">
                      {profileData.display_name || profileData.username}
                    </h1>
                    <p className="text-sm text-white/80">@{profileData.username}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <Button
                    onClick={onSave}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-1.5 h-auto text-xs"
                  >
                    Simpan
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={onEditToggle}
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 text-white p-2 h-auto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 text-white p-2 h-auto"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-3.5 h-3.5 text-white" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/70 truncate">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bio Section */}
            {(profileData.bio || isEditing) && (
              <div className="space-y-2">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Ceritakan tentang diri Anda..."
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 text-sm resize-none"
                    rows={3}
                  />
                ) : (
                  <div>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {showFullBio ? profileData.bio : `${profileData.bio?.slice(0, 100)}${(profileData.bio?.length || 0) > 100 ? '...' : ''}`}
                    </p>
                    {(profileData.bio?.length || 0) > 100 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-xs text-[#A56ABD] hover:text-white transition-colors mt-1"
                      >
                        {showFullBio ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Location & Join Date */}
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/70">
              {profileData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{profileData.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Bergabung {new Date(profileData.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Immersive Header */}
      <div className="hidden md:block">
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#49225B] via-[#6E3482] to-[#A56ABD] shadow-2xl">
          <CardContent className="p-8 text-white">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border-4 border-white/30 overflow-hidden"
                >
                  {profileData.avatar_url ? (
                    <img 
                      src={profileData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-white" />
                  )}
                </motion.div>
                {isEditing && (
                  <motion.label
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#A56ABD] rounded-full flex items-center justify-center cursor-pointer border-3 border-white shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="hidden"
                    />
                  </motion.label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          name="display_name"
                          value={profileData.display_name}
                          onChange={handleInputChange}
                          className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 text-xl font-bold"
                          placeholder="Nama Tampilan"
                        />
                        <input
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70"
                          placeholder="Username"
                        />
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-3xl font-bold text-white">
                          {profileData.display_name || profileData.username}
                        </h1>
                        <p className="text-lg text-white/80">@{profileData.username}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isEditing ? (
                      <Button
                        onClick={onSave}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                      >
                        Simpan Perubahan
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={onEditToggle}
                          variant="ghost"
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profil
                        </Button>
                        <Button
                          variant="ghost"
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Bagikan
                        </Button>
                        <Button
                          variant="ghost"
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Grid - 4 columns */}
                <div className="grid grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-white/20 to-white/10">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-white/70">{stat.label}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bio */}
                {(profileData.bio || isEditing) && (
                  <div>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio || ''}
                        onChange={handleInputChange}
                        placeholder="Ceritakan tentang diri Anda, pengalaman memancing, dan pencapaian yang ingin dibagikan..."
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 resize-none"
                        rows={4}
                      />
                    ) : (
                      <p className="text-white/90 leading-relaxed max-w-3xl">
                        {profileData.bio}
                      </p>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-white/70">
                  {profileData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {new Date(profileData.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimizedProfileHeader;
