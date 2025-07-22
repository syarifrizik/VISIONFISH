
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { ProfileData } from '@/hooks/useProfile';

interface ProfileBioProps {
  profileData: ProfileData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileBio = ({ profileData, isEditing, handleInputChange }: ProfileBioProps) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold text-[#49225B] mb-4">Bio</h3>
      {!isEditing ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#A56ABD]/20">
          <p className="text-[#6E3482] text-base leading-relaxed">
            {profileData.bio || "Belum ada bio. Ceritakan tentang diri Anda dengan mengklik tombol Edit Profil."}
          </p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#A56ABD]/30">
          <Textarea 
            name="bio"
            value={profileData.bio || ''}
            onChange={handleInputChange}
            placeholder="Ceritakan tentang diri Anda..."
            className="resize-none border-[#A56ABD]/30 focus:border-[#6E3482] bg-white text-[#49225B] placeholder:text-[#A56ABD] min-h-[120px]"
            rows={5}
          />
          <p className="text-xs text-[#A56ABD] mt-2">
            Maksimal 500 karakter untuk bio Anda
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileBio;
