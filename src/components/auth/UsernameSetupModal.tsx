
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { setUserProfile } from '@/services/usernameService';
import { UsernameInput } from '@/components/auth/UsernameInput';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface UsernameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string;
  onSuccess: () => void;
}

export const UsernameSetupModal = ({ 
  isOpen, 
  onClose, 
  userEmail, 
  userId, 
  onSuccess 
}: UsernameSetupModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate suggested username from email
  useEffect(() => {
    if (userEmail && !username) {
      const emailPrefix = userEmail.split('@')[0];
      const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9_]/g, '_');
      setUsername(cleanUsername);
    }
  }, [userEmail, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUsernameValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await setUserProfile(userId, username, userEmail);
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to set user profile:', result.message);
      }
    } catch (error) {
      console.error('Error setting user profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = userEmail.split('@')[0];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent 
        className={cn(
          "max-w-md mx-auto [&>button]:hidden", // Hide the close button completely
          isDark 
            ? "bg-gray-900/95 border-gray-700" 
            : "bg-white/95 border-gray-300"
        )}
      >
        <DialogHeader>
          <DialogTitle className={cn(
            "text-center text-xl font-bold",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Lengkapi Profil Anda
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <p className={cn(
              "text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Selamat datang, <span className="font-semibold">{displayName}</span>!
            </p>
            <p className={cn(
              "text-xs",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              Silakan pilih username untuk melengkapi profil Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <UsernameInput
              value={username}
              onChange={setUsername}
              onValidationChange={setIsUsernameValid}
              placeholder="pilih_username_anda"
              label="Username"
              required
              isDark={isDark}
            />

            <Button
              type="submit"
              disabled={!isUsernameValid || isSubmitting}
              className={cn(
                "w-full h-12 font-semibold transition-all duration-300",
                isUsernameValid
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Lanjutkan'
              )}
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
