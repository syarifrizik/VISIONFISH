
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAuthDebug = (componentName: string) => {
  const authContext = useAuth();

  useEffect(() => {
    console.log(`${componentName} - Auth Debug:`, {
      hasAuthContext: !!authContext,
      user: authContext?.user ? {
        id: authContext.user.id,
        email: authContext.user.email
      } : null,
      isLoggedIn: authContext?.isLoggedIn,
      isLoading: authContext?.isLoading,
      isPremium: authContext?.isPremium
    });
  }, [authContext, componentName]);

  return authContext;
};
