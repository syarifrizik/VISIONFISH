
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useUsernameValidation } from '@/hooks/useUsernameValidation';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { Upload, User, MapPin, FileText, Loader2, Check, X, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedImageUpload from '@/components/profile/EnhancedImageUpload';

interface ModernEditProfileDialogProps {
  currentProfile: any;
  onProfileUpdated: (updatedProfile?: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModernEditProfileDialog = ({
  currentProfile,
  onProfileUpdated,
  open,
  onOpenChange
}: ModernEditProfileDialogProps) => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    username: currentProfile?.username || '',
    display_name: currentProfile?.display_name || '',
    bio: currentProfile?.bio || '',
    location: currentProfile?.location || '',
    avatar_url: currentProfile?.avatar_url || ''
  };

  const {
    formData,
    updateFormData,
    clearDraft,
    isDirty,
    lastSaved,
    isAutoSaving
  } = useFormPersistence({
    key: `edit_profile_${user?.id}`,
    initialData: initialFormData,
    autoSaveDelay: 1500,
    enablePersistence: open
  });

  const {
    isValid: isUsernameValid,
    isChecking: isCheckingUsername,
    message: usernameMessage,
    status: usernameStatus,
    validateUsername
  } = useUsernameValidation(currentProfile?.username);

  // Validate username when it changes
  useEffect(() => {
    if (formData.username && formData.username !== currentProfile?.username) {
      validateUsername(formData.username);
    }
  }, [formData.username, validateUsername, currentProfile?.username]);

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleImageUpload = (imageUrl: string) => {
    console.log('ModernEditProfileDialog: Image uploaded, updating form data with URL:', imageUrl);
    updateFormData({ avatar_url: imageUrl });
  };

  const handleImageRemove = () => {
    console.log('ModernEditProfileDialog: Removing avatar image');
    updateFormData({ avatar_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUsernameValid && formData.username !== currentProfile?.username) {
      toast({
        title: "❌ Username Tidak Valid",
        description: usernameMessage,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('ModernEditProfileDialog: Submitting profile update with data:', formData);
      
      const result = await updateProfile({
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url
      });

      if (result?.success) {
        // IMMEDIATE: Create updated profile object with EXACT form data
        const updatedProfile = {
          ...currentProfile,
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          location: formData.location,
          avatar_url: formData.avatar_url, // Use EXACT form data, not database response
          updated_at: new Date().toISOString()
        };
        
        console.log('ModernEditProfileDialog: Profile updated successfully, calling onProfileUpdated with EXACT data:', updatedProfile);
        
        clearDraft();
        
        // IMMEDIATE: Call parent callback with exact form data first
        onProfileUpdated(updatedProfile);
        
        onOpenChange(false);
        toast({
          title: "✅ Profil Diperbarui!",
          description: "Perubahan profil Anda telah disimpan dan langsung diterapkan"
        });
      }
    } catch (error) {
      console.error('ModernEditProfileDialog: Error updating profile:', error);
      toast({
        title: "❌ Gagal Memperbarui",
        description: "Terjadi kesalahan saat menyimpan profil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?')) {
        clearDraft();
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'available':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'taken':
        return <X className="w-4 h-4 text-red-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getUsernameStatusColor = () => {
    switch (usernameStatus) {
      case 'available':
        return 'text-green-600 dark:text-green-400';
      case 'taken':
      case 'invalid':
        return 'text-red-600 dark:text-red-400';
      case 'checking':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`
        sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0
        ${isDark 
          ? 'bg-gray-900/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
        } 
        backdrop-blur-xl shadow-2xl
      `}>
        {/* Header */}
        <DialogHeader className={`
          px-6 py-4 border-b
          ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
        `}>
          <DialogTitle className={`
            text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
            ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'}
          `}>
            Edit Profil
          </DialogTitle>
          <AnimatePresence>
            {(isDirty || isAutoSaving) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm mt-2"
              >
                {isAutoSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                    <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      Menyimpan draft...
                    </span>
                  </>
                ) : lastSaved ? (
                  <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Draft tersimpan {lastSaved.toLocaleTimeString('id-ID')}
                  </span>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Foto Profil
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload foto profil baru atau gunakan foto yang sudah ada
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-blue-500/20 shadow-xl">
                <AvatarImage 
                  src={formData.avatar_url} 
                  alt="Profile"
                  onLoad={() => console.log('Dialog avatar preview loaded:', formData.avatar_url)}
                  onError={() => console.log('Dialog avatar preview failed:', formData.avatar_url)}
                />
                <AvatarFallback className={`
                  text-2xl font-bold
                  ${isDark 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }
                `}>
                  {formData.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <EnhancedImageUpload
              currentImageUrl={formData.avatar_url}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              disabled={isSubmitting}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-3">
              <Label 
                htmlFor="username" 
                className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                <User className="w-4 h-4" />
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="username_anda"
                  className={`
                    pr-10 transition-all duration-200
                    ${isDark 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400' 
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                    }
                  `}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getUsernameStatusIcon()}
                </div>
              </div>
              <AnimatePresence>
                {usernameMessage && formData.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`text-sm ${getUsernameStatusColor()}`}
                  >
                    {usernameMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Display Name Field */}
            <div className="space-y-3">
              <Label 
                htmlFor="display_name"
                className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Nama Tampilan
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                placeholder="Nama yang akan ditampilkan"
                className={`
                  transition-all duration-200
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }
                `}
              />
            </div>

            {/* Location Field */}
            <div className="space-y-3">
              <Label 
                htmlFor="location" 
                className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                <MapPin className="w-4 h-4" />
                Lokasi
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Kota, Negara"
                className={`
                  transition-all duration-200
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }
                `}
              />
            </div>

            {/* Bio Field */}
            <div className="space-y-3">
              <Label 
                htmlFor="bio" 
                className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                <FileText className="w-4 h-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Ceritakan tentang diri Anda..."
                rows={4}
                className={`
                  resize-none transition-all duration-200
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }
                `}
              />
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.bio.length}/500 karakter
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`
            flex gap-4 pt-6 border-t
            ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
          `}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className={`
                flex-1 h-12 font-medium transition-all duration-200
                ${isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (formData.username !== currentProfile?.username && !isUsernameValid)}
              className={`
                flex-1 h-12 font-medium transition-all duration-200
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                text-white shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModernEditProfileDialog;
