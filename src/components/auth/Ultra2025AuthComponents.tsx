import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { 
  Fish, 
  Sparkles, 
  Zap, 
  Shield, 
  Waves, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Loader2,
  ArrowRight,
  X,
  Mail,
  Lock,
  KeyRound
} from 'lucide-react';

// Advanced Gradient Background
export const GradientBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base Gradient */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-1000",
          isDark 
            ? "bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950" 
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        )}
      />
      
      {/* Interactive Mouse Gradient */}
      <div 
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: isDark 
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 69, 255, 0.15) 0%, transparent 50%)`
            : `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />
      
      {/* Animated Mesh Gradients */}
      <div className="absolute inset-0">
        {/* Primary Orb */}
        <motion.div
          className={cn(
            "absolute w-96 h-96 rounded-full filter blur-3xl transition-colors duration-1000",
            isDark ? "bg-blue-500/20" : "bg-blue-400/30"
          )}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        
        {/* Secondary Orb */}
        <motion.div
          className={cn(
            "absolute w-80 h-80 rounded-full filter blur-3xl transition-colors duration-1000",
            isDark ? "bg-purple-500/20" : "bg-purple-400/30"
          )}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        
        {/* Tertiary Orb */}
        <motion.div
          className={cn(
            "absolute w-72 h-72 rounded-full filter blur-3xl transition-colors duration-1000",
            isDark ? "bg-cyan-500/15" : "bg-cyan-400/25"
          )}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </div>
      
      {/* Floating Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-1 h-1 rounded-full transition-colors duration-1000",
            isDark ? "bg-white/30" : "bg-blue-500/40"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Grid Pattern */}
      <div className={cn(
        "absolute inset-0 bg-[size:40px_40px] opacity-20 transition-opacity duration-1000",
        isDark 
          ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
          : "bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]"
      )} />
    </div>
  );
};

// Glass Morphism Card
interface GlassMorphCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassMorphCard = ({ children, className }: GlassMorphCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        'relative backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300',
        isDark 
          ? 'bg-white/10 border-white/20 shadow-black/20'
          : 'bg-white/70 border-white/60 shadow-blue-900/10',
        className
      )}
    >
      {/* Shimmer Effect */}
      <div className={cn(
        "absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-300",
        "bg-gradient-to-br from-transparent via-white/10 to-transparent",
        "animate-[shimmer_3s_ease-in-out_infinite]"
      )} />
      
      {/* Border Glow */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-all duration-300",
        isDark 
          ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 p-[1px]"
          : "bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 p-[1px]"
      )}>
        <div className={cn(
          "h-full w-full rounded-3xl transition-colors duration-300",
          isDark ? "bg-slate-900/50" : "bg-white/90"
        )} />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Modern Input Component
interface ModernInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
}

export const ModernInput = ({
  type,
  placeholder,
  value,
  onChange,
  label,
  showPassword,
  onTogglePassword,
  required = false
}: ModernInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (type === 'email') {
      setIsValid(value.includes('@') && value.includes('.'));
    } else {
      setIsValid(value.length >= 3);
    }
  }, [value, type]);

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "block text-sm font-semibold tracking-wide transition-colors duration-300",
            isDark ? "text-white/90" : "text-slate-700"
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative group">
        <motion.div
          className={cn(
            'relative flex items-center transition-all duration-500',
            isFocused && 'scale-[1.02]'
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            className={cn(
              'w-full h-14 px-6 pr-12 backdrop-blur-xl border-2 rounded-2xl transition-all duration-500',
              'focus:outline-none focus:ring-0 font-medium text-base placeholder:font-normal',
              'focus:border-transparent focus:ring-4',
              isDark 
                ? 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:ring-blue-500/20 focus:bg-white/10'
                : 'bg-white/90 border-slate-200/60 text-slate-700 placeholder-slate-400 focus:ring-blue-500/20 focus:bg-white',
              isValid && value && (isDark ? 'border-emerald-500/50' : 'border-emerald-500/60'),
              'transition-all duration-500'
            )}
          />
          
          {/* Password Toggle */}
          {type === 'password' && onTogglePassword && (
            <motion.button
              type="button"
              onClick={onTogglePassword}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute right-4 p-2 rounded-xl transition-all duration-300",
                isDark 
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              )}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </motion.button>
          )}
          
          {/* Validation Indicator */}
          {value && type !== 'password' && (
            <motion.div
              className="absolute right-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle2 
                className={cn(
                  'h-5 w-5 transition-colors duration-300',
                  isValid ? 'text-emerald-500' : 'text-red-500'
                )}
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Focus Indicator */}
        <motion.div
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 rounded-full transition-colors duration-300",
            isDark 
              ? "bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: isFocused ? '100%' : '0%' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Fluid Button Component
interface FluidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FluidButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = ''
}: FluidButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return isDark 
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 text-white'
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white';
      case 'secondary':
        return isDark
          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 shadow-lg shadow-purple-500/25 text-white'
          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg shadow-purple-500/30 text-white';
      default:
        return isDark 
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 text-white'
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'relative h-14 px-8 rounded-2xl font-bold transition-all duration-500 group overflow-hidden',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-4',
        isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-600/30',
        getVariantStyles(),
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      <div className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </div>
    </motion.button>
  );
};

// Reset Password Form Component
interface ResetPasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export const ResetPasswordForm = ({
  onSubmit,
  isLoading,
  onBack
}: ResetPasswordFormProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword && newPassword.length > 0);
    
    // Simple password strength calculation
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (newPassword.match(/[a-z]/)) strength += 1;
    if (newPassword.match(/[A-Z]/)) strength += 1;
    if (newPassword.match(/[0-9]/)) strength += 1;
    if (newPassword.match(/[^a-zA-Z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMatch && passwordStrength >= 3 && !isLoading) {
      await onSubmit(newPassword);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-red-500';
    if (passwordStrength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 2) return 'Lemah';
    if (passwordStrength < 4) return 'Sedang';
    return 'Kuat';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border shadow-2xl",
          isDark 
            ? "bg-white/10 border-white/20" 
            : "bg-white/80 border-white/60"
        )}>
          <KeyRound className={cn(
            "w-8 h-8",
            isDark ? "text-cyan-400" : "text-blue-600"
          )} />
        </div>
        
        <h2 className={cn(
          "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          isDark 
            ? "from-blue-400 via-purple-400 to-cyan-400" 
            : "from-blue-600 via-purple-600 to-cyan-600"
        )}>
          Buat Password Baru
        </h2>
        <p className={cn(
          "text-sm font-medium",
          isDark ? "text-white/70" : "text-slate-600"
        )}>
          Masukkan password baru untuk akun Anda
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <ModernInput
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="Password Baru"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Kekuatan Password:</span>
                <span className={cn(
                  "text-xs font-medium",
                  passwordStrength < 2 ? "text-red-500" : 
                  passwordStrength < 4 ? "text-yellow-500" : "text-green-500"
                )}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn("h-2 rounded-full transition-all duration-300", getStrengthColor())}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <ModernInput
          type="password"
          placeholder="Konfirmasi password baru"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Konfirmasi Password"
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          required
        />

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center gap-2 text-sm">
            {passwordMatch ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span className={passwordMatch ? "text-green-600" : "text-red-600"}>
              {passwordMatch ? "Password cocok" : "Password tidak cocok"}
            </span>
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "flex-1 h-12 px-6 rounded-xl font-semibold transition-all duration-300",
              isDark 
                ? "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            )}
          >
            Kembali
          </button>
          
          <FluidButton
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!passwordMatch || passwordStrength < 3 || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Mengubah...' : 'Ubah Password'}
          </FluidButton>
        </div>
      </form>
    </motion.div>
  );
};

// Forgot Password Modal Component
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: ForgotPasswordModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(email.includes('@') && email.includes('.'));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      await onSubmit(email);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassMorphCard className="p-8">
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-xl transition-all duration-300",
                  isDark 
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
              >
                <X className="h-5 w-5" />
              </motion.button>

              {/* Header */}
              <motion.div 
                className="text-center space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border shadow-2xl",
                  isDark 
                    ? "bg-white/10 border-white/20" 
                    : "bg-white/80 border-white/60"
                )}>
                  <Lock className={cn(
                    "w-8 h-8",
                    isDark ? "text-cyan-400" : "text-blue-600"
                  )} />
                </div>
                
                <h2 className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  isDark 
                    ? "from-blue-400 via-purple-400 to-cyan-400" 
                    : "from-blue-600 via-purple-600 to-cyan-600"
                )}>
                  Lupa Password
                </h2>
                <p className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/70" : "text-slate-600"
                )}>
                  Masukkan email Anda dan kami akan mengirimkan link reset password
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <ModernInput
                  type="email"
                  placeholder="Alamat email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  required
                />
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={cn(
                      "flex-1 h-12 px-6 rounded-xl font-semibold transition-all duration-300",
                      isDark 
                        ? "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    )}
                  >
                    Batal
                  </button>
                  
                  <motion.button
                    type="submit"
                    disabled={!isValid || isLoading}
                    whileHover={{ scale: !isValid || isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: !isValid || isLoading ? 1 : 0.98 }}
                    className={cn(
                      'flex-1 h-12 px-6 rounded-xl font-semibold transition-all duration-500 overflow-hidden',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'focus:outline-none focus:ring-4',
                      isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-600/30',
                      isDark 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 text-white'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Kirim Reset</span>
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </form>
            </GlassMorphCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Branding Section
export const BrandingSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: Shield,
      title: "AI-Powered Recognition",
      description: "Teknologi AI terdepan untuk identifikasi spesies ikan dengan akurasi tinggi",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Analisis instan dengan hasil yang dapat diandalkan dalam hitungan detik",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Waves,
      title: "Comprehensive Database",
      description: "Database spesies ikan terlengkap dengan informasi detail dan akurat",
      gradient: "from-cyan-400 to-blue-500"
    }
  ];

  return (
    <div className="flex flex-col justify-center px-12 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Logo & Brand */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center backdrop-blur-xl border shadow-2xl",
                isDark 
                  ? "bg-white/10 border-white/20" 
                  : "bg-white/80 border-white/60"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Fish className={cn(
                "w-12 h-12",
                isDark ? "text-cyan-400" : "text-blue-600"
              )} />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                isDark 
                  ? "from-blue-400 via-purple-400 to-cyan-400" 
                  : "from-blue-600 via-purple-600 to-cyan-600"
              )}>
                VisionFish
              </h1>
              <p className={cn(
                "text-2xl flex items-center gap-3 font-bold mt-2",
                isDark ? "text-white/90" : "text-slate-700"
              )}>
                <Sparkles className={cn(
                  "h-6 w-6",
                  isDark ? "text-cyan-400" : "text-blue-600"
                )} />
                AI Fishery Platform
              </p>
            </div>
          </div>
          
          <motion.p 
            className={cn(
              "text-xl leading-relaxed font-medium",
              isDark ? "text-white/80" : "text-slate-600"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolusi identifikasi ikan dengan teknologi AI canggih. 
            Bergabunglah dengan komunitas peneliti dan nelayan modern 
            untuk masa depan perikanan yang berkelanjutan.
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          <h3 className={cn(
            "text-3xl font-bold flex items-center gap-3",
            isDark ? "text-white" : "text-slate-800"
          )}>
            <Sparkles className={cn(
              "h-8 w-8",
              isDark ? "text-cyan-400" : "text-blue-600"
            )} />
            Fitur Unggulan
          </h3>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={cn(
                  "flex items-start gap-4 p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300",
                  isDark 
                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                    : "bg-white/60 border-white/40 hover:bg-white/80"
                )}
              >
                <div className={cn(
                  'p-3 rounded-2xl bg-gradient-to-r shadow-xl',
                  feature.gradient
                )}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-lg mb-2",
                    isDark ? "text-white" : "text-slate-800"
                  )}>{feature.title}</h4>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    isDark ? "text-white/70" : "text-slate-600"
                  )}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Success Overlay
interface SuccessOverlayProps {
  show: boolean;
  message: string;
}

export const SuccessOverlay = ({ show, message }: SuccessOverlayProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <GlassMorphCard className="p-8 text-center max-w-md mx-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              <h3 className={cn(
                "text-2xl font-bold mb-3 transition-colors duration-300",
                isDark ? "text-white" : "text-slate-800"
              )}>Berhasil!</h3>
              <p className={cn(
                "text-lg transition-colors duration-300",
                isDark ? "text-white/80" : "text-slate-600"
              )}>{message}</p>
            </GlassMorphCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
