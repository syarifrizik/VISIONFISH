
import { useState, useEffect, useCallback } from 'react';
import { checkUsernameAvailability } from '@/services/usernameService';
import { debounce } from 'lodash';

interface UsernameValidationState {
  isValid: boolean;
  isChecking: boolean;
  message: string;
  status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
}

export const useUsernameValidation = (currentUsername?: string) => {
  const [validationState, setValidationState] = useState<UsernameValidationState>({
    isValid: false,
    isChecking: false,
    message: '',
    status: 'idle'
  });

  const debouncedCheck = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setValidationState({
          isValid: false,
          isChecking: false,
          message: 'Username harus minimal 3 karakter',
          status: 'invalid'
        });
        return;
      }

      // Check format first
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setValidationState({
          isValid: false,
          isChecking: false,
          message: 'Username hanya boleh huruf, angka, dan underscore',
          status: 'invalid'
        });
        return;
      }

      // Skip validation if it's the same as current username
      if (username === currentUsername) {
        setValidationState({
          isValid: true,
          isChecking: false,
          message: 'Username saat ini',
          status: 'available'
        });
        return;
      }

      setValidationState(prev => ({
        ...prev,
        isChecking: true,
        status: 'checking',
        message: 'Mengecek ketersediaan...'
      }));

      try {
        const result = await checkUsernameAvailability(username);
        setValidationState({
          isValid: result.available,
          isChecking: false,
          message: result.message,
          status: result.available ? 'available' : 'taken'
        });
      } catch (error) {
        setValidationState({
          isValid: false,
          isChecking: false,
          message: 'Terjadi kesalahan saat mengecek username',
          status: 'invalid'
        });
      }
    }, 500),
    [currentUsername]
  );

  const validateUsername = useCallback((username: string) => {
    if (!username) {
      setValidationState({
        isValid: false,
        isChecking: false,
        message: '',
        status: 'idle'
      });
      return;
    }

    debouncedCheck(username);
  }, [debouncedCheck]);

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  return {
    ...validationState,
    validateUsername
  };
};
