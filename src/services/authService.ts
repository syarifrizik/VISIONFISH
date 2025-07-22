import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface AuthResult {
  success: boolean;
  message: string;
  action?: 'login' | 'resend_confirmation' | 'check_email';
  userStatus?: 'new' | 'unconfirmed' | 'confirmed';
}

const getDetailedErrorMessage = (error: any): { message: string; action?: string; userStatus?: string } => {
  console.log("Full error object:", error);
  
  // User already registered but not confirmed
  if (error.message?.includes('User already registered') || 
      error.message?.includes('email_address_not_authorized') ||
      error.message?.includes('signup_disabled')) {
    return {
      message: "Email ini sudah terdaftar sebelumnya tetapi belum dikonfirmasi. Silakan cek email Anda untuk link konfirmasi.",
      action: 'resend_confirmation',
      userStatus: 'unconfirmed'
    };
  }
  
  // Invalid login credentials
  if (error.message?.includes('Invalid login credentials')) {
    return {
      message: "Email atau password salah. Pastikan Anda sudah mengonfirmasi email atau periksa kembali data login Anda.",
      action: 'check_email',
      userStatus: 'unconfirmed'
    };
  }
  
  // Email not confirmed during login
  if (error.message?.includes('Email not confirmed')) {
    return {
      message: "Akun Anda sudah terdaftar namun email belum dikonfirmasi. Silakan cek email Anda untuk link konfirmasi.",
      action: 'resend_confirmation',
      userStatus: 'unconfirmed'
    };
  }
  
  // Too many requests
  if (error.message?.includes('too_many_requests') || error.message?.includes('rate limit')) {
    return {
      message: "Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.",
      userStatus: 'confirmed'
    };
  }
  
  // Weak password
  if (error.message?.includes('Password should be at least')) {
    return {
      message: "Password terlalu lemah. Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.",
      userStatus: 'new'
    };
  }
  
  // Invalid email format
  if (error.message?.includes('Invalid email')) {
    return {
      message: "Format email tidak valid. Silakan periksa kembali email Anda.",
      userStatus: 'new'
    };
  }
  
  return {
    message: error.message || "Terjadi kesalahan yang tidak diketahui",
    userStatus: 'new'
  };
};

export const loginWithEmailPassword = async (email: string, password: string): Promise<AuthResult> => {
  try {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Login error:", error.message);
      const errorDetails = getDetailedErrorMessage(error);
      return {
        success: false,
        message: errorDetails.message,
        action: errorDetails.action as any,
        userStatus: errorDetails.userStatus as any
      };
    }

    console.log("Login successful:", data.user?.id);
    return {
      success: true,
      message: "Login berhasil! Selamat datang kembali.",
      userStatus: 'confirmed'
    };
  } catch (error) {
    console.error("Login exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Login gagal";
    return {
      success: false,
      message: errorMessage,
      userStatus: 'new'
    };
  }
};

export const signupWithEmailPassword = async (email: string, password: string): Promise<AuthResult> => {
  try {
    console.log("Attempting signup for:", email);
    
    // Use dynamic URL for redirect
    const redirectUrl = `${window.location.origin}/`;
    
    // Langsung lakukan signup tanpa pre-check
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          // You can add additional user metadata here
        }
      }
    });
    
    console.log("Signup response - data:", data, "error:", error);
    
    // Jika tidak ada error tapi user ada dan session tidak ada, ini bisa berarti:
    // 1. User baru yang perlu konfirmasi email
    // 2. User lama yang sudah terdaftar (repeated signup)
    if (!error && data.user && !data.session) {
      console.log("User exists but no session - checking if this is a repeated signup");
      
      // Coba login untuk menentukan apakah ini user baru atau lama
      const loginTest = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginTest.error) {
        if (loginTest.error.message?.includes('Invalid login credentials')) {
          // Ini kemungkinan user baru dengan password yang benar tapi belum dikonfirmasi,
          // atau user lama dengan password salah
          // Kita anggap ini user baru karena signup berhasil
          console.log("Treating as new user needing confirmation");
          return {
            success: true,
            message: "Akun berhasil dibuat! Email konfirmasi telah dikirim ke " + email + ". Silakan cek email Anda dan klik link konfirmasi untuk mengaktifkan akun.",
            action: 'check_email',
            userStatus: 'unconfirmed'
          };
        } else if (loginTest.error.message?.includes('Email not confirmed')) {
          // User sudah ada tapi belum dikonfirmasi
          console.log("User already exists but not confirmed");
          return {
            success: false,
            message: "Email ini sudah terdaftar tetapi belum dikonfirmasi. Silakan cek email Anda untuk link konfirmasi.",
            action: 'resend_confirmation',
            userStatus: 'unconfirmed'
          };
        } else {
          // Error lain
          console.log("Other login error during test:", loginTest.error.message);
          return {
            success: true,
            message: "Akun berhasil dibuat! Email konfirmasi telah dikirim ke " + email + ". Silakan cek email Anda dan klik link konfirmasi untuk mengaktifkan akun.",
            action: 'check_email',
            userStatus: 'unconfirmed'
          };
        }
      } else {
        // Login test berhasil = user sudah ada dan sudah dikonfirmasi
        console.log("User already exists and is confirmed");
        
        // Logout dari test login
        await supabase.auth.signOut();
        
        return {
          success: false,
          message: "Email ini sudah terdaftar dan aktif. Silakan gunakan tombol 'Masuk' untuk login.",
          action: 'login',
          userStatus: 'confirmed'
        };
      }
    }
    
    if (error) {
      console.error("Signup error:", error);
      const errorDetails = getDetailedErrorMessage(error);
      return {
        success: false,
        message: errorDetails.message,
        action: errorDetails.action as any,
        userStatus: errorDetails.userStatus as any
      };
    }

    // Signup berhasil dengan session (email confirmation disabled)
    if (data.user && data.session) {
      console.log("User created and immediately confirmed");
      return {
        success: true,
        message: "Akun berhasil dibuat dan langsung aktif! Selamat bergabung.",
        userStatus: 'confirmed'
      };
    }

    // Default success message
    return {
      success: true,
      message: "Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.",
      action: 'check_email',
      userStatus: 'unconfirmed'
    };
  } catch (error) {
    console.error("Signup exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Pendaftaran gagal";
    return {
      success: false,
      message: errorMessage,
      userStatus: 'new'
    };
  }
};

export const loginWithGoogle = async (): Promise<AuthResult> => {
  try {
    console.log("Attempting Google login");
    
    // Use dynamic URL for redirect
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error("Google login error:", error.message);
      return {
        success: false,
        message: "Gagal login dengan Google. Silakan coba lagi.",
        userStatus: 'new'
      };
    }

    console.log("Google login initiated successfully");
    return {
      success: true,
      message: "Mengarahkan ke Google untuk login...",
      userStatus: 'confirmed'
    };
  } catch (error) {
    console.error("Google login exception:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login dengan Google",
      userStatus: 'new'
    };
  }
};

export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    console.log("Attempting password reset for:", email);
    
    // PERBAIKAN: Gunakan URL yang benar tanpa parameter tambahan
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      console.error("Password reset error:", error);
      
      if (error.message?.includes('too_many_requests') || error.message?.includes('rate limit')) {
        return {
          success: false,
          message: "Terlalu banyak permintaan reset password. Silakan tunggu beberapa menit sebelum mencoba lagi.",
          userStatus: 'confirmed'
        };
      }
      
      return {
        success: false,
        message: "Gagal mengirim email reset password. Silakan coba lagi.",
        userStatus: 'confirmed'
      };
    }

    console.log("Password reset email sent successfully");
    return {
      success: true,
      message: "Email reset password telah dikirim ke " + email + "! Silakan cek kotak masuk dan folder spam Anda.",
      action: 'check_email',
      userStatus: 'confirmed'
    };
  } catch (error) {
    console.error("Password reset exception:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengirim email reset password.",
      userStatus: 'confirmed'
    };
  }
};

export const updatePassword = async (newPassword: string): Promise<AuthResult> => {
  try {
    console.log("Attempting to update password");
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Password update error:", error);
      
      if (error.message?.includes('Password should be at least')) {
        return {
          success: false,
          message: "Password terlalu lemah. Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.",
          userStatus: 'confirmed'
        };
      }
      
      return {
        success: false,
        message: "Gagal mengubah password. Silakan coba lagi.",
        userStatus: 'confirmed'
      };
    }

    console.log("Password updated successfully");
    return {
      success: true,
      message: "Password berhasil diubah! Anda dapat menggunakan password baru untuk login.",
      userStatus: 'confirmed'
    };
  } catch (error) {
    console.error("Password update exception:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengubah password.",
      userStatus: 'confirmed'
    };
  }
};

export const resendConfirmation = async (email: string): Promise<AuthResult> => {
  try {
    // Use dynamic URL for redirect
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error("Resend confirmation error:", error);
      return {
        success: false,
        message: "Gagal mengirim ulang konfirmasi. Silakan coba lagi nanti.",
        userStatus: 'unconfirmed'
      };
    }

    return {
      success: true,
      message: "Email konfirmasi telah dikirim ulang ke " + email + "! Silakan cek kotak masuk dan folder spam Anda.",
      action: 'check_email',
      userStatus: 'unconfirmed'
    };
  } catch (error) {
    console.error("Resend confirmation exception:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengirim ulang konfirmasi.",
      userStatus: 'unconfirmed'
    };
  }
};

export const logout = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        message: error.message,
        userStatus: 'confirmed'
      };
    }

    return {
      success: true,
      message: "Logout berhasil. Sampai jumpa lagi!",
      userStatus: 'new'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Logout gagal";
    return {
      success: false,
      message: errorMessage,
      userStatus: 'confirmed'
    };
  }
};
