
import { supabase } from '@/integrations/supabase/client';

export interface ProductPromotion {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price?: string;
  contact_info?: string;
  image_url?: string;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export const fetchPromotions = async (): Promise<ProductPromotion[]> => {
  try {
    // Get promotion messages from chat_messages table
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('is_promotion', true)
      .eq('message_type', 'promotion')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user profiles for the promotion messages
    const userIds = messages?.map(msg => msg.user_id) || [];
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', userIds);

    if (profileError) throw profileError;

    // Map the data to match ProductPromotion interface
    const promotions: ProductPromotion[] = (messages || []).map(msg => {
      const profile = profiles?.find(p => p.id === msg.user_id);
      return {
        id: msg.id,
        user_id: msg.user_id,
        title: 'Promotion', // Default title since content is the main field
        description: msg.content,
        image_url: msg.image_url || undefined,
        is_active: !msg.is_pinned, // Use pinned as inactive indicator
        view_count: msg.likes_count || 0, // Use likes as view count
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        profile: profile ? {
          username: profile.username || '',
          display_name: profile.display_name || '',
          avatar_url: profile.avatar_url || ''
        } : undefined
      };
    });

    return promotions;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
};

export const fetchUserPromotions = async (userId: string): Promise<ProductPromotion[]> => {
  try {
    // Get user's promotion messages
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('is_promotion', true)
      .eq('message_type', 'promotion')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Map the data
    const promotions: ProductPromotion[] = (messages || []).map(msg => ({
      id: msg.id,
      user_id: msg.user_id,
      title: 'Promotion',
      description: msg.content,
      image_url: msg.image_url || undefined,
      is_active: !msg.is_pinned,
      view_count: msg.likes_count || 0,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      profile: profile ? {
        username: profile.username || '',
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || ''
      } : undefined
    }));

    return promotions;
  } catch (error) {
    console.error('Error fetching user promotions:', error);
    return [];
  }
};

export const createPromotion = async (
  userId: string,
  promotionData: Omit<ProductPromotion, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'view_count' | 'profile'>
): Promise<{ success: boolean; message: string; promotion?: ProductPromotion }> => {
  try {
    // Create promotion as a chat message
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        content: promotionData.description,
        message_type: 'promotion',
        is_promotion: true,
        image_url: promotionData.image_url || null
      })
      .select()
      .single();

    if (error) throw error;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', userId)
      .single();

    const newPromotion: ProductPromotion = {
      id: message.id,
      user_id: message.user_id,
      title: promotionData.title,
      description: message.content,
      price: promotionData.price,
      contact_info: promotionData.contact_info,
      image_url: message.image_url || undefined,
      is_active: promotionData.is_active,
      view_count: 0,
      created_at: message.created_at,
      updated_at: message.updated_at,
      profile: profile ? {
        username: profile.username || '',
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || ''
      } : undefined
    };

    return { success: true, message: 'Promosi berhasil dibuat', promotion: newPromotion };
  } catch (error) {
    console.error('Error creating promotion:', error);
    return { success: false, message: 'Gagal membuat promosi' };
  }
};

export const updatePromotion = async (
  promotionId: string,
  updates: Partial<Omit<ProductPromotion, 'id' | 'user_id' | 'created_at' | 'profile'>>
): Promise<{ success: boolean; message: string }> => {
  try {
    const updateData: any = {};
    
    if (updates.description !== undefined) {
      updateData.content = updates.description;
    }
    if (updates.image_url !== undefined) {
      updateData.image_url = updates.image_url;
    }
    if (updates.is_active !== undefined) {
      updateData.is_pinned = !updates.is_active; // Invert for our mapping
    }

    const { error } = await supabase
      .from('chat_messages')
      .update(updateData)
      .eq('id', promotionId);

    if (error) throw error;

    return { success: true, message: 'Promosi berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating promotion:', error);
    return { success: false, message: 'Gagal memperbarui promosi' };
  }
};

export const deletePromotion = async (promotionId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', promotionId);

    if (error) throw error;

    return { success: true, message: 'Promosi berhasil dihapus' };
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return { success: false, message: 'Gagal menghapus promosi' };
  }
};

export const checkPromotionLimit = async (userId: string): Promise<{ canCreate: boolean; remainingCount: number }> => {
  try {
    // Check if user is premium
    const { data: isPremium } = await supabase.rpc('is_user_premium', { user_uuid: userId });
    
    if (isPremium) {
      return { canCreate: true, remainingCount: -1 }; // Unlimited for premium
    }

    // Count today's promotions for free users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: promotions, error } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('user_id', userId)
      .eq('is_promotion', true)
      .gte('created_at', today.toISOString());

    if (error) throw error;

    const todayCount = promotions?.length || 0;
    const remainingCount = Math.max(0, 3 - todayCount);

    return { canCreate: remainingCount > 0, remainingCount };
  } catch (error) {
    console.error('Error checking promotion limit:', error);
    return { canCreate: false, remainingCount: 0 };
  }
};
