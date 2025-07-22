
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkPremiumStatus } from '@/services/premiumService';
import { loginWithEmailPassword, signupWithEmailPassword } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPremium: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  needsUsernameSetup: boolean;
  setIsPremium: (isPremium: boolean) => void;
  refreshPremiumStatus: () => Promise<void>;
  handleLogin: (email: string, password: string) => Promise<{ success: boolean; message: string; action?: string; userStatus?: string }>;
  handleSignup: (email: string, password: string, username: string) => Promise<{ success: boolean; message: string; action?: string; userStatus?: string }>;
  handleLogout: () => Promise<{ success: boolean; message: string }>;
  completeUsernameSetup: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsUsernameSetup, setNeedsUsernameSetup] = useState(false);

  const refreshPremiumStatus = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Refreshing premium status for user:', user.id);
      const premiumStatus = await checkPremiumStatus(user.id);
      console.log('Premium status result:', premiumStatus);
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Error refreshing premium status:', error);
    }
  };

  const checkAdminStatus = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const isGoogleOAuthUser = (user: User) => {
    return user.app_metadata?.provider === 'google' || 
           user.app_metadata?.providers?.includes('google') ||
           !!user.user_metadata?.name; // Google users have name in metadata
  };

  const getProperDisplayName = (user: User) => {
    // For Google OAuth users, use the name from Google metadata
    if (isGoogleOAuthUser(user)) {
      return user.user_metadata?.name || 
             user.user_metadata?.full_name ||
             user.email?.split('@')[0] || 
             'User';
    }
    
    // For email/password users, use email prefix
    return user.email?.split('@')[0] || 'User';
  };

  const checkUserProfile = async (userId: string, isGoogleUser: boolean = false) => {
    try {
      console.log('Checking user profile for:', userId, 'isGoogleUser:', isGoogleUser);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user profile:', error);
        return;
      }

      console.log('Profile data:', profile);

      // For Google OAuth users, always check if username is missing
      if (isGoogleUser) {
        const needsSetup = !profile || 
                          !profile.username || 
                          profile.username === null;
        console.log('Google user needs username setup:', needsSetup);
        setNeedsUsernameSetup(needsSetup);
        return;
      }

      // For email/password users, check if username needs setup
      const needsSetup = !profile || 
                        !profile.username || 
                        profile.username.includes('@') ||
                        profile.username === profile.display_name;

      console.log('Regular user needs username setup:', needsSetup);
      setNeedsUsernameSetup(needsSetup);
    } catch (error) {
      console.error('Profile check exception:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        const isGoogle = isGoogleOAuthUser(session.user);
        // For Google users, wait a bit longer for profile to be created
        const delay = isGoogle ? 2000 : 500;
        setTimeout(() => {
          checkUserProfile(session.user.id, isGoogle);
        }, delay);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Check profile and premium status when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          const isGoogle = isGoogleOAuthUser(session.user);
          console.log('User signed in, isGoogle:', isGoogle);
          
          // Delay profile check for Google users to ensure profile is created
          const delay = isGoogle ? 2000 : 500;
          setTimeout(async () => {
            await checkUserProfile(session.user.id, isGoogle);
            await refreshPremiumStatus();
            await checkAdminStatus();
          }, delay);
          
          // Handle successful login redirect to dashboard
          if (window.location.pathname === '/auth') {
            console.log('Checking if redirect to dashboard is needed');
            // Wait longer for Google users to complete profile setup check
            const redirectDelay = isGoogle ? 3000 : 1000;
            setTimeout(() => {
              checkUserProfile(session.user.id, isGoogle).then(() => {
                setTimeout(() => {
                  if (!needsUsernameSetup) {
                    console.log('Redirecting to dashboard after successful login');
                    window.location.href = '/';
                  }
                }, 1000);
              });
            }, redirectDelay);
          }
        }
        
        // Reset username setup flag when user logs out
        if (event === 'SIGNED_OUT') {
          setNeedsUsernameSetup(false);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check premium status when user changes
  useEffect(() => {
    if (user?.id) {
      refreshPremiumStatus();
      checkAdminStatus();
    } else {
      setIsPremium(false);
      setIsAdmin(false);
    }
  }, [user?.id]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginWithEmailPassword(email, password);
      return {
        success: result.success,
        message: result.message,
        action: result.action,
        userStatus: result.userStatus
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat login',
        userStatus: 'new'
      };
    }
  };

  const handleSignup = async (email: string, password: string, username: string) => {
    try {
      const result = await signupWithEmailPassword(email, password);
      return {
        success: result.success,
        message: result.message,
        action: result.action,
        userStatus: result.userStatus
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat membuat akun',
        userStatus: 'new'
      };
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsPremium(false);
      setIsAdmin(false);
      setNeedsUsernameSetup(false);
      return { success: true, message: 'Logout berhasil!' };
    } catch (error) {
      return { success: false, message: 'Terjadi kesalahan saat logout' };
    }
  };

  const completeUsernameSetup = () => {
    setNeedsUsernameSetup(false);
  };

  const value = {
    user,
    session,
    isLoading,
    isPremium,
    isLoggedIn: !!user && !!session,
    isAdmin,
    needsUsernameSetup,
    setIsPremium,
    refreshPremiumStatus,
    handleLogin,
    handleSignup,
    handleLogout,
    completeUsernameSetup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
