import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { 
  GlassMorphCard, 
  ModernInput, 
  FluidButton, 
  BrandingSection, 
  GradientBackground,
  SuccessOverlay,
  ForgotPasswordModal,
  ResetPasswordForm
} from '@/components/auth/Ultra2025AuthComponents';
import { AuthNotification } from '@/components/auth/AuthNotification';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import AuthDivider from '@/components/auth/AuthDivider';
import { UsernameSetupModal } from '@/components/auth/UsernameSetupModal';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { NavbarFooter } from '@/components/navigation/NavbarFooter';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Activity, Fish, CloudRain, MessageCircle, Crown, Settings, Layers, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { loginWithEmailPassword, signupWithEmailPassword, resendConfirmation, loginWithGoogle, resetPassword, updatePassword } from '@/services/authService';
import { checkUsernameAvailability } from '@/services/usernameService';
import { supabase } from '@/integrations/supabase/client';

const Ultra2025AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { user, needsUsernameSetup, completeUsernameSetup } = useAuth();
  const isDark = theme === 'dark';
  
  // PERBAIKAN: Deteksi password reset flow dan error handling
  const isPasswordReset = searchParams.get('type') === 'recovery';
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const urlError = searchParams.get('error');
  
  console.log('URL Parameters:', {
    type: searchParams.get('type'),
    access_token: accessToken ? 'present' : 'missing',
    refresh_token: refreshToken ? 'present' : 'missing',
    error: urlError,
    full_url: window.location.href
  });
  
  const [activeTab, setActiveTab] = useState('masuk');
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [usernameCheckResult, setUsernameCheckResult] = useState<{ available: boolean; message: string } | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [authResult, setAuthResult] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    action?: string;
    userStatus?: string;
    email?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Forgot Password States
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);

  // Password Reset States
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Navigation items for the header and mobile footer
  const navItems: NavItem[] = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/fish-analysis', label: 'Analisis', icon: Activity },
    { path: '/species-id', label: 'Spesies', icon: Fish },
    { path: '/weather', label: 'Cuaca', icon: CloudRain },
    { path: '/ai-iot', label: 'Ai&IoT', icon: Layers },
    { path: '/chatroom', label: 'Chatroom', icon: MessageCircle },
    { path: '/premium', label: 'Premium', icon: Crown, desktopOnly: true },
    { path: '/settings', label: 'Pengaturan', icon: Settings },
  ];

  // Real-time username validation for signup
  const handleUsernameChange = (value: string) => {
    const cleanUsername = value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    setSignupUsername(cleanUsername);
    
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }
    
    if (cleanUsername.length >= 3) {
      const timeout = setTimeout(async () => {
        setIsCheckingUsername(true);
        const result = await checkUsernameAvailability(cleanUsername);
        setUsernameCheckResult(result);
        setIsCheckingUsername(false);
      }, 500);
      
      setUsernameCheckTimeout(timeout);
    } else {
      setUsernameCheckResult(null);
    }
  };

  // PERBAIKAN: Handle password reset flow dengan deteksi yang lebih baik
  useEffect(() => {
    console.log('Auth page useEffect - checking URL params:', {
      type: searchParams.get('type'),
      access_token: accessToken ? 'present' : 'missing',
      refresh_token: refreshToken ? 'present' : 'missing',
      error: urlError,
      isPasswordReset
    });

    // Handle URL errors first
    if (urlError) {
      if (urlError === 'invalid_token') {
        setAuthResult({
          type: 'error',
          message: 'Link reset password tidak valid atau sudah expired. Silakan minta reset password baru.',
          userStatus: 'confirmed'
        });
      } else if (urlError === 'verification_failed') {
        setAuthResult({
          type: 'error',
          message: 'Gagal memverifikasi link reset password. Silakan coba lagi.',
          userStatus: 'confirmed'
        });
      }
      // Clean the URL
      window.history.replaceState({}, document.title, '/auth');
      return;
    }

    if (isPasswordReset) {
      console.log('Password reset flow detected');
      
      if (accessToken && refreshToken) {
        console.log('Tokens found, setting session for password reset');
        
        // PERBAIKAN: Set session dengan format yang benar
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error setting session:', error);
            setAuthResult({
              type: 'error',
              message: 'Link reset password tidak valid atau sudah expired. Silakan minta reset password lagi.',
              userStatus: 'confirmed'
            });
          } else {
            console.log('Session set successfully for password reset, showing reset form');
            setShowResetPasswordForm(true);
            // Clean the URL untuk keamanan
            window.history.replaceState({}, document.title, '/auth');
          }
        });
      } else {
        // Jika tidak ada token, berarti link expired atau invalid
        console.log('No tokens found for password reset, showing error');
        setAuthResult({
          type: 'error',
          message: 'Link reset password tidak valid atau sudah expired. Silakan minta reset password baru.',
          userStatus: 'confirmed'
        });
        // Clean the URL
        window.history.replaceState({}, document.title, '/auth');
      }
    }
  }, [isPasswordReset, accessToken, refreshToken, searchParams, urlError]);

  const handleGoogleLogin = async () => {
    setAuthResult(null);
    setIsGoogleLoading(true);
    
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        setAuthResult({
          type: 'info',
          message: result.message,
          userStatus: result.userStatus
        });
        // Google OAuth will handle the redirect automatically
      } else {
        setAuthResult({
          type: 'error',
          message: result.message,
          userStatus: result.userStatus
        });
      }
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Terjadi kesalahan saat login dengan Google',
        userStatus: 'new'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthResult(null);
    setIsSubmitting(true);
    
    try {
      const result = await loginWithEmailPassword(loginEmail, loginPassword);
      
      if (result.success) {
        // Reset failed attempts on success
        setFailedLoginAttempts(0);
        localStorage.removeItem('failedLoginAttempts');
        
        setAuthResult({
          type: 'success',
          message: result.message,
          userStatus: result.userStatus
        });
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Increment failed attempts
        const newFailedAttempts = failedLoginAttempts + 1;
        setFailedLoginAttempts(newFailedAttempts);
        localStorage.setItem('failedLoginAttempts', newFailedAttempts.toString());
        
        setAuthResult({
          type: 'error',
          message: result.message,
          action: result.action,
          userStatus: result.userStatus,
          email: loginEmail
        });
        
        // Auto-trigger forgot password modal after 3 failed attempts
        if (newFailedAttempts >= 3) {
          setTimeout(() => {
            setShowForgotPasswordModal(true);
          }, 2000); // Show modal 2 seconds after error message
        }
      }
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Terjadi kesalahan yang tidak terduga',
        userStatus: 'new'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthResult(null);
    
    // Check username availability before submitting
    if (!usernameCheckResult?.available) {
      setAuthResult({
        type: 'error',
        message: 'Silakan pilih username yang valid dan tersedia',
        userStatus: 'new'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await signupWithEmailPassword(signupEmail, signupPassword);
      
      if (result.success) {
        setAuthResult({
          type: result.userStatus === 'confirmed' ? 'success' : 'info',
          message: result.message,
          action: result.action,
          userStatus: result.userStatus,
          email: signupEmail
        });
        
        if (result.userStatus === 'confirmed') {
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } else {
        setAuthResult({
          type: 'error',
          message: result.message,
          action: result.action,
          userStatus: result.userStatus,
          email: signupEmail
        });
        
        // Auto-switch to login if user already exists and is confirmed
        if (result.action === 'login') {
          setTimeout(() => {
            setLoginEmail(signupEmail);
            setActiveTab('masuk');
          }, 3000);
        }
      }
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Terjadi kesalahan yang tidak terduga',
        userStatus: 'new'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = authResult?.email || signupEmail || loginEmail;
    if (!email) return;
    
    setIsResending(true);
    try {
      const result = await resendConfirmation(email);
      setAuthResult({
        type: result.success ? 'info' : 'error',
        message: result.message,
        action: result.action,
        userStatus: result.userStatus,
        email: email
      });
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Gagal mengirim ulang konfirmasi',
        userStatus: 'unconfirmed'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setIsResetPasswordLoading(true);
    
    try {
      const result = await resetPassword(email);
      
      setAuthResult({
        type: result.success ? 'info' : 'error',
        message: result.message,
        action: result.action,
        userStatus: result.userStatus,
        email: email
      });
      
      if (result.success) {
        setShowForgotPasswordModal(false);
        // Reset failed attempts after successful password reset request
        setFailedLoginAttempts(0);
        localStorage.removeItem('failedLoginAttempts');
      }
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Terjadi kesalahan saat mengirim email reset password',
        userStatus: 'confirmed'
      });
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (newPassword: string) => {
    setIsUpdatingPassword(true);
    
    try {
      const result = await updatePassword(newPassword);
      
      if (result.success) {
        setAuthResult({
          type: 'success',
          message: result.message,
          userStatus: result.userStatus
        });
        setShowSuccess(true);
        
        // PERBAIKAN: Sign out untuk clear temporary session and redirect to login
        await supabase.auth.signOut();
        
        setTimeout(() => {
          setShowResetPasswordForm(false);
          setShowSuccess(false);
          setAuthResult({
            type: 'info',
            message: 'Password berhasil diubah! Silakan login dengan password baru Anda.',
            userStatus: 'confirmed'
          });
          // Pastikan user kembali ke tab login
          setActiveTab('masuk');
        }, 2000);
      } else {
        setAuthResult({
          type: 'error',
          message: result.message,
          userStatus: result.userStatus
        });
      }
    } catch (err) {
      setAuthResult({
        type: 'error',
        message: 'Terjadi kesalahan saat mengubah password',
        userStatus: 'confirmed'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleBackToLogin = () => {
    setShowResetPasswordForm(false);
    setAuthResult(null);
    // Pastikan user kembali ke tab login
    setActiveTab('masuk');
  };

  const handleActionClick = (action: string) => {
    if (action === 'login') {
      setActiveTab('masuk');
      if (authResult?.email) {
        setLoginEmail(authResult.email);
      }
    }
  };

  const handleUsernameSetupSuccess = () => {
    completeUsernameSetup();
    navigate('/profile');
  };

  // Mock functions for navbar compatibility
  const handleLoginClick = () => navigate('/auth');
  const handleLogoutClick = () => {};

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden font-['Inter',sans-serif] flex flex-col",
      "ultra-2025-auth-container"
    )}>
      <GradientBackground />
      
      {/* Header Navigation - using same as other pages */}
      <DesktopNav
        navItems={navItems}
        isLoggedIn={false}
        isPremium={false}
        theme={theme}
        setTheme={setTheme}
        handleLogin={handleLoginClick}
        handleLogout={handleLogoutClick}
        mobileMenuOpen={false}
        setMobileMenuOpen={() => {}}
      />
      
      <div className="relative z-10 flex-1 pt-0 pb-20 lg:pb-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-160px)]">
          {/* Left Side - Branding */}
          <BrandingSection />
          
          {/* Right Side - Auth Form or Reset Password Form */}
          <div className="flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <GlassMorphCard className="p-8">
                {showResetPasswordForm ? (
                  <ResetPasswordForm
                    onSubmit={handleResetPasswordSubmit}
                    isLoading={isUpdatingPassword}
                    onBack={handleBackToLogin}
                  />
                ) : (
                  <>
                    <motion.div 
                      className="text-center space-y-4 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <h2 className={cn(
                        "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        isDark 
                          ? "from-blue-400 via-purple-400 to-cyan-400" 
                          : "from-blue-600 via-purple-600 to-cyan-600"
                      )}>
                        Selamat Datang
                      </h2>
                      <p className={cn(
                        "text-lg font-medium",
                        isDark ? "text-white/80" : "text-slate-600"
                      )}>
                        Bergabunglah dengan revolusi AI perikanan
                      </p>
                    </motion.div>
                    
                    {authResult && (
                      <AuthNotification
                        type={authResult.type}
                        message={authResult.message}
                        action={authResult.action as any}
                        userEmail={authResult.email}
                        onActionClick={handleActionClick}
                        onResendConfirmation={handleResendConfirmation}
                        isResending={isResending}
                        isDark={isDark}
                      />
                    )}

                    {/* Google Login Button */}
                    <div className="mb-6">
                      <GoogleAuthButton 
                        onGoogleLogin={handleGoogleLogin}
                        isLoading={isGoogleLoading}
                      />
                    </div>

                    <AuthDivider text="OR CONTINUE WITH EMAIL" />

                    {/* Keep existing Tabs content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className={cn(
                        "grid w-full grid-cols-2 h-14 rounded-2xl p-1",
                        isDark 
                          ? "bg-white/5 backdrop-blur-md border border-white/10" 
                          : "bg-slate-100/80 backdrop-blur-md border border-slate-200/50"
                      )}>
                        <TabsTrigger 
                          value="masuk" 
                          className={cn(
                            "rounded-xl transition-all duration-500 font-semibold text-base h-12",
                            "data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25",
                            isDark 
                              ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-white/70"
                              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-slate-800 text-slate-600"
                          )}
                        >
                          Masuk
                        </TabsTrigger>
                        <TabsTrigger 
                          value="daftar" 
                          className={cn(
                            "rounded-xl transition-all duration-500 font-semibold text-base h-12",
                            "data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25",
                            isDark 
                              ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white text-white/70"
                              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-slate-800 text-slate-600"
                          )}
                        >
                          Daftar
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="masuk" className="space-y-6 mt-8">
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                          <ModernInput
                            type="email"
                            placeholder="Alamat email Anda"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            label="Email"
                            required
                          />
                          
                          <ModernInput
                            type="password"
                            placeholder="Password Anda"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            label="Password"
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            required
                          />
                          
                          {/* Forgot Password Link */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowForgotPasswordModal(true)}
                              className={cn(
                                "text-sm font-medium transition-colors duration-300 hover:underline",
                                isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
                              )}
                            >
                              Lupa Password?
                            </button>
                          </div>
                          
                          <FluidButton
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? 'Memproses...' : 'Masuk ke Dashboard'}
                          </FluidButton>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="daftar" className="space-y-6 mt-8">
                        <form onSubmit={handleSignupSubmit} className="space-y-6">
                          <div className="relative">
                            <ModernInput
                              type="text"
                              placeholder="Username unik Anda"
                              value={signupUsername}
                              onChange={(e) => handleUsernameChange(e.target.value)}
                              label="Username"
                              required
                            />
                            
                            <div className="absolute right-3 top-9">
                              {isCheckingUsername ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                              ) : usernameCheckResult ? (
                                usernameCheckResult.available ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )
                              ) : null}
                            </div>
                            
                            <AnimatePresence>
                              {usernameCheckResult && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className={cn(
                                    "text-xs font-medium mt-1",
                                    usernameCheckResult.available ? "text-green-600" : "text-red-600"
                                  )}
                                >
                                  {usernameCheckResult.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <ModernInput
                            type="email"
                            placeholder="Alamat email aktif"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            label="Email"
                            required
                          />
                          
                          <ModernInput
                            type="password"
                            placeholder="Buat password yang kuat"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            label="Password"
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            required
                          />
                          
                          <FluidButton
                            type="submit"
                            variant="secondary"
                            loading={isSubmitting}
                            disabled={isSubmitting || !usernameCheckResult?.available}
                            className="w-full"
                          >
                            {isSubmitting ? 'Memproses...' : 'Buat Akun Baru'}
                          </FluidButton>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </GlassMorphCard>
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden min-h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-sm"
            >
              <GlassMorphCard className="p-6">
                {showResetPasswordForm ? (
                  <ResetPasswordForm
                    onSubmit={handleResetPasswordSubmit}
                    isLoading={isUpdatingPassword}
                    onBack={handleBackToLogin}
                  />
                ) : (
                  <>
                    <motion.div 
                      className="text-center space-y-3 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h2 className={cn(
                        "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        isDark 
                          ? "from-blue-400 via-purple-400 to-cyan-400" 
                          : "from-blue-600 via-purple-600 to-cyan-600"
                      )}>
                        VisionFish
                      </h2>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-white/70" : "text-slate-600"
                      )}>
                        Platform AI Perikanan Modern
                      </p>
                    </motion.div>
                    
                    {authResult && (
                      <AuthNotification
                        type={authResult.type}
                        message={authResult.message}
                        action={authResult.action as any}
                        userEmail={authResult.email}
                        onActionClick={handleActionClick}
                        onResendConfirmation={handleResendConfirmation}
                        isResending={isResending}
                        isDark={isDark}
                      />
                    )}

                    {/* Google Login Button for Mobile */}
                    <div className="mb-4">
                      <GoogleAuthButton 
                        onGoogleLogin={handleGoogleLogin}
                        isLoading={isGoogleLoading}
                      />
                    </div>

                    <AuthDivider text="OR" />

                    {/* Keep existing Tabs content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className={cn(
                        "grid w-full grid-cols-2 h-12 rounded-xl p-1 mb-6",
                        isDark 
                          ? "bg-white/5 backdrop-blur-md border border-white/10" 
                          : "bg-slate-100/80 backdrop-blur-md border border-slate-200/50"
                      )}>
                        <TabsTrigger 
                          value="masuk" 
                          className={cn(
                            "rounded-lg transition-all duration-500 font-semibold text-sm h-10",
                            isDark 
                              ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-white/70"
                              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-slate-800 text-slate-600"
                          )}
                        >
                          Masuk
                        </TabsTrigger>
                        <TabsTrigger 
                          value="daftar" 
                          className={cn(
                            "rounded-lg transition-all duration-500 font-semibold text-sm h-10",
                            isDark 
                              ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white text-white/70"
                              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-slate-800 text-slate-600"
                          )}
                        >
                          Daftar
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="masuk" className="space-y-4">
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                          <ModernInput
                            type="email"
                            placeholder="Email Anda"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                          
                          <ModernInput
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            required
                          />
                          
                          {/* Mobile Forgot Password Link */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowForgotPasswordModal(true)}
                              className={cn(
                                "text-xs font-medium transition-colors duration-300 hover:underline",
                                isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
                              )}
                            >
                              Lupa Password?
                            </button>
                          </div>
                          
                          <FluidButton
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? 'Masuk...' : 'Masuk'}
                          </FluidButton>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="daftar" className="space-y-4">
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                          <ModernInput
                            type="text"
                            placeholder="Username"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            required
                          />
                          
                          <ModernInput
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                          />
                          
                          <ModernInput
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            required
                          />
                          
                          <FluidButton
                            type="submit"
                            variant="secondary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? 'Daftar...' : 'Daftar'}
                          </FluidButton>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </GlassMorphCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Footer - Added for mobile consistency */}
      <NavbarFooter navItems={navItems} />

      {/* Footer - Made responsive (visible on desktop, hidden on mobile due to mobile nav) */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      <SuccessOverlay show={showSuccess} message={showResetPasswordForm ? "Password berhasil diubah!" : "Berhasil! Mengarahkan ke dashboard..."} />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPasswordSubmit}
        isLoading={isResetPasswordLoading}
      />
      
      {/* Username Setup Modal for Google Users */}
      {user && needsUsernameSetup && (
        <UsernameSetupModal
          isOpen={true}
          onClose={() => {}}
          userEmail={user.email || ''}
          userId={user.id}
          onSuccess={handleUsernameSetupSuccess}
        />
      )}
    </div>
  );
};

export default Ultra2025AuthPage;
