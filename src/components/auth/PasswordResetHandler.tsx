
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const PasswordResetHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handlePasswordResetRedirect = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const redirectTo = searchParams.get('redirect_to');

      console.log('PasswordResetHandler - URL params:', {
        token: token ? 'present' : 'missing',
        type,
        redirect_to: redirectTo
      });

      if (type === 'recovery' && token) {
        try {
          // Verify the token dengan Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          console.log('Token verification result:', { data, error });

          if (error) {
            console.error('Token verification failed:', error);
            // Redirect ke auth dengan error message
            navigate('/auth?error=invalid_token');
          } else if (data.session) {
            console.log('Token verified successfully, redirecting to reset form');
            // Redirect ke auth page dengan session info untuk reset password
            navigate(`/auth?type=recovery&access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`);
          }
        } catch (err) {
          console.error('Error verifying token:', err);
          navigate('/auth?error=verification_failed');
        }
      } else {
        console.log('Not a password recovery request, redirecting to auth');
        navigate('/auth');
      }
    };

    handlePasswordResetRedirect();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memproses link reset password...</p>
      </div>
    </div>
  );
};
