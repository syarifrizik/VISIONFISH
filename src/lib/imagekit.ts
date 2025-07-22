
import ImageKit from 'imagekit-javascript';
import { supabase } from '@/integrations/supabase/client';

export const imageKitConfig = {
  publicKey: 'public_6DEaCuwFm1AC6hFFipRzsERO0tA=',
  urlEndpoint: 'https://ik.imagekit.io/biajcse64',
  authenticationEndpoint: 'https://hxekcssuzixhieadgcxx.supabase.co/functions/v1/imagekit-auth'
};

// Initialize ImageKit instance for client-side operations
export const imageKit = new ImageKit({
  publicKey: imageKitConfig.publicKey,
  urlEndpoint: imageKitConfig.urlEndpoint
});

// Helper function to get authentication parameters from our edge function
const getAuthParams = async (): Promise<{token: string, expire: number, signature: string}> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(imageKitConfig.authenticationEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': imageKitConfig.publicKey
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get authentication parameters');
  }

  return response.json();
};

// Updated helper function to upload image to ImageKit using proper SDK
export const uploadToImageKit = async (file: File, fileName?: string): Promise<string> => {
  try {
    // Get authentication parameters
    const authParams = await getAuthParams();
    
    // Upload using ImageKit SDK
    const result = await imageKit.upload({
      file: file,
      fileName: fileName || `${Date.now()}_${file.name}`,
      folder: '/VisionFish/community',
      token: authParams.token,
      signature: authParams.signature,
      expire: authParams.expire,
      useUniqueFileName: true
    });

    return result.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (url: string, transformations?: Record<string, any>) => {
  if (!transformations) return url;
  
  const params = new URLSearchParams();
  Object.entries(transformations).forEach(([key, value]) => {
    params.append(`tr:${key}`, value.toString());
  });
  
  return `${url}?${params.toString()}`;
};
