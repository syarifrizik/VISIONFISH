
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  reply_to?: string;
  is_pinned: boolean;
  is_promotion: boolean;
  created_at: string;
  updated_at: string;
  message_type: 'question' | 'news' | 'promotion' | 'general';
  likes_count: number;
  image_url?: string;
  profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  isLikedByUser?: boolean;
}

export const fetchChatMessages = async (limit: number = 50): Promise<ChatMessage[]> => {
  try {
    // Using any to bypass TypeScript issues until types are regenerated
    const { data: messages, error } = await (supabase as any)
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    if (!messages || messages.length === 0) return [];
    
    // Get unique user IDs with proper type casting
    const userIds = [...new Set(messages.map((msg: any) => msg.user_id).filter(Boolean))] as string[];
    
    // Fetch profiles separately
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', userIds);
    
    // Get current user's likes
    const { data: { user } } = await supabase.auth.getUser();
    let userLikes: string[] = [];
    
    if (user) {
      const { data: likes } = await (supabase as any)
        .from('message_likes')
        .select('message_id')
        .eq('user_id', user.id);
      
      userLikes = likes?.map((like: any) => like.message_id) || [];
    }
    
    // Create profile map
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    return messages.map((message: any) => ({
      ...message,
      message_type: (message.message_type as 'question' | 'news' | 'promotion' | 'general') || 'general',
      likes_count: message.likes_count || 0,
      isLikedByUser: userLikes.includes(message.id),
      profile: message.user_id && profileMap.has(message.user_id) ? {
        username: profileMap.get(message.user_id)!.username || '',
        display_name: profileMap.get(message.user_id)!.display_name || '',
        avatar_url: profileMap.get(message.user_id)!.avatar_url || '/placeholder.svg'
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const sendChatMessage = async (
  content: string, 
  replyTo?: string, 
  messageType: 'question' | 'news' | 'promotion' | 'general' = 'general',
  imageUrl?: string
): Promise<ChatMessage> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data: messageData, error } = await (supabase as any)
      .from('chat_messages')
      .insert({
        user_id: user.id,
        content,
        reply_to: replyTo || null,
        is_pinned: false,
        is_promotion: messageType === 'promotion',
        message_type: messageType,
        image_url: imageUrl || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Fetch user profile separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .single();
    
    return {
      ...messageData,
      message_type: messageType,
      likes_count: 0,
      isLikedByUser: false,
      profile: profile ? {
        username: profile.username || '',
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || '/placeholder.svg'
      } : undefined
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const deleteChatMessage = async (messageId: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting chat message:', error);
    throw error;
  }
};

export const pinChatMessage = async (messageId: string, isPinned: boolean): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('chat_messages')
      .update({ is_pinned: isPinned })
      .eq('id', messageId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error pinning chat message:', error);
    throw error;
  }
};

export const likeMessage = async (messageId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user already liked this message
    const { data: existingLike } = await (supabase as any)
      .from('message_likes')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike the message
      const { error } = await (supabase as any)
        .from('message_likes')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } else {
      // Like the message
      const { error } = await (supabase as any)
        .from('message_likes')
        .insert({
          message_id: messageId,
          user_id: user.id
        });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error liking message:', error);
    throw error;
  }
};

export const getUserLikedMessages = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: likes } = await (supabase as any)
      .from('message_likes')
      .select('message_id')
      .eq('user_id', user.id);

    return likes?.map((like: any) => like.message_id) || [];
  } catch (error) {
    console.error('Error fetching user liked messages:', error);
    return [];
  }
};

// Function to upload and compress image
export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Compress image before upload
    const compressedFile = await compressImage(file);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, compressedFile);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to compress image
const compressImage = async (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
