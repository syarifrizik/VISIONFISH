export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievement_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_activities: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analysis_sessions: {
        Row: {
          analysis_count: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string
          last_analysis: string | null
          session_fingerprint: string
          user_id: string | null
        }
        Insert: {
          analysis_count?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address: string
          last_analysis?: string | null
          session_fingerprint: string
          user_id?: string | null
        }
        Update: {
          analysis_count?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string
          last_analysis?: string | null
          session_fingerprint?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by_admin: string | null
          current_usage: number | null
          daily_limit: number | null
          id: string
          is_active: boolean | null
          key_value: string
          last_reset_at: string | null
          name: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_admin?: string | null
          current_usage?: number | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          key_value: string
          last_reset_at?: string | null
          name: string
          provider?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_admin?: string | null
          current_usage?: number | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          key_value?: string
          last_reset_at?: string | null
          name?: string
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_customizations: {
        Row: {
          background_pattern: string | null
          bubble_style: string | null
          conversation_id: string
          created_at: string | null
          custom_sounds: boolean | null
          emoji_reactions_enabled: boolean | null
          id: string
          is_premium_feature: boolean | null
          theme_color: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          background_pattern?: string | null
          bubble_style?: string | null
          conversation_id: string
          created_at?: string | null
          custom_sounds?: boolean | null
          emoji_reactions_enabled?: boolean | null
          id?: string
          is_premium_feature?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          background_pattern?: string | null
          bubble_style?: string | null
          conversation_id?: string
          created_at?: string | null
          custom_sounds?: boolean | null
          emoji_reactions_enabled?: boolean | null
          id?: string
          is_premium_feature?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_pinned: boolean | null
          is_promotion: boolean | null
          likes_count: number | null
          message_type: string | null
          reply_to: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_promotion?: boolean | null
          likes_count?: number | null
          message_type?: string | null
          reply_to?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_promotion?: boolean | null
          likes_count?: number | null
          message_type?: string | null
          reply_to?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_typing_status: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_typing: boolean | null
          last_typed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_typing?: boolean | null
          last_typed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_typing?: boolean | null
          last_typed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comment_replies: {
        Row: {
          comment_id: string | null
          content: string | null
          created_at: string | null
          id: string
          likes_count: number | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_views: {
        Row: {
          id: string
          ip_address: string | null
          post_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          post_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          post_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_private: boolean | null
          likes_count: number | null
          location: string | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_private?: boolean | null
          likes_count?: number | null
          location?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_private?: boolean | null
          likes_count?: number | null
          location?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_community_posts_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sessions: {
        Row: {
          command_history: string[]
          created_at: string
          device_id: string
          device_type: string
          id: string
          last_active: string
          preferences: Json
          updated_at: string
          user_id: string
          voice_settings: Json
        }
        Insert: {
          command_history?: string[]
          created_at?: string
          device_id: string
          device_type: string
          id?: string
          last_active?: string
          preferences?: Json
          updated_at?: string
          user_id: string
          voice_settings?: Json
        }
        Update: {
          command_history?: string[]
          created_at?: string
          device_id?: string
          device_type?: string
          id?: string
          last_active?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
          voice_settings?: Json
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string | null
          created_at: string | null
          edited_at: string | null
          id: string
          is_deleted: boolean | null
          is_read: boolean | null
          media_url: string | null
          message_status: string | null
          message_type: string | null
          reactions: Json | null
          read_at: string | null
          receiver_id: string | null
          reply_to_id: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_status?: string | null
          message_type?: string | null
          reactions?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_status?: string | null
          message_type?: string | null
          reactions?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fish_catches: {
        Row: {
          bait_used: string | null
          catch_time: string | null
          created_at: string | null
          duration_hours: number | null
          fishing_gear: string | null
          fishing_method: string | null
          id: string
          image_urls: string[] | null
          is_private: boolean | null
          is_record: boolean | null
          is_released: boolean | null
          length_cm: number | null
          location: string | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          species_name: string
          updated_at: string | null
          user_id: string
          water_temperature: number | null
          weather_condition: string | null
          weight_kg: number | null
        }
        Insert: {
          bait_used?: string | null
          catch_time?: string | null
          created_at?: string | null
          duration_hours?: number | null
          fishing_gear?: string | null
          fishing_method?: string | null
          id?: string
          image_urls?: string[] | null
          is_private?: boolean | null
          is_record?: boolean | null
          is_released?: boolean | null
          length_cm?: number | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          species_name: string
          updated_at?: string | null
          user_id: string
          water_temperature?: number | null
          weather_condition?: string | null
          weight_kg?: number | null
        }
        Update: {
          bait_used?: string | null
          catch_time?: string | null
          created_at?: string | null
          duration_hours?: number | null
          fishing_gear?: string | null
          fishing_method?: string | null
          id?: string
          image_urls?: string[] | null
          is_private?: boolean | null
          is_record?: boolean | null
          is_released?: boolean | null
          length_cm?: number | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          species_name?: string
          updated_at?: string | null
          user_id?: string
          water_temperature?: number | null
          weather_condition?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fish_catches_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fish_species_history: {
        Row: {
          created_at: string
          id: string
          last_used_at: string
          species_name: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string
          species_name: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string
          species_name?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      image_upload_usage: {
        Row: {
          context: string
          created_at: string | null
          id: string
          updated_at: string | null
          upload_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          context: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          upload_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          context?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          upload_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      message_likes: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_likes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string | null
          id: string
          message_id: string | null
          reaction_emoji: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          reaction_emoji: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          reaction_emoji?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      midtrans_transactions: {
        Row: {
          created_at: string | null
          currency: string | null
          gross_amount: number
          id: string
          metadata: Json | null
          order_id: string
          payment_type: string | null
          settlement_time: string | null
          snap_redirect_url: string | null
          snap_token: string | null
          transaction_id: string | null
          transaction_status: string | null
          transaction_time: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          gross_amount: number
          id?: string
          metadata?: Json | null
          order_id: string
          payment_type?: string | null
          settlement_time?: string | null
          snap_redirect_url?: string | null
          snap_token?: string | null
          transaction_id?: string | null
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          gross_amount?: number
          id?: string
          metadata?: Json | null
          order_id?: string
          payment_type?: string | null
          settlement_time?: string | null
          snap_redirect_url?: string | null
          snap_token?: string | null
          transaction_id?: string | null
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      note_likes: {
        Row: {
          created_at: string
          id: string
          note_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_likes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_views: {
        Row: {
          id: string
          ip_address: string | null
          note_id: string
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          note_id: string
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          note_id?: string
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_views_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          category: string
          color: string | null
          content: string | null
          created_at: string | null
          fishing_data: Json | null
          id: string
          images: Json | null
          is_archived: boolean | null
          is_pinned: boolean | null
          is_private: boolean
          likes_count: number | null
          location: string | null
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
          voice_notes: Json | null
        }
        Insert: {
          category?: string
          color?: string | null
          content?: string | null
          created_at?: string | null
          fishing_data?: Json | null
          id?: string
          images?: Json | null
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean
          likes_count?: number | null
          location?: string | null
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
          voice_notes?: Json | null
        }
        Update: {
          category?: string
          color?: string | null
          content?: string | null
          created_at?: string | null
          fishing_data?: Json | null
          id?: string
          images?: Json | null
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean
          likes_count?: number | null
          location?: string | null
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
          voice_notes?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_push_sent: boolean | null
          is_read: boolean | null
          metadata: Json | null
          priority: string | null
          related_post_id: string | null
          related_user_id: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_push_sent?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_push_sent?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_status_logs: {
        Row: {
          checked_at: string | null
          created_at: string | null
          id: string
          response_data: Json | null
          status: string
          status_message: string | null
          transaction_id: string
        }
        Insert: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          response_data?: Json | null
          status: string
          status_message?: string | null
          transaction_id: string
        }
        Update: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          response_data?: Json | null
          status?: string
          status_message?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_status_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_id: string | null
          id: string
          payment_data: Json | null
          payment_method_id: string | null
          status: string | null
          subscription_duration_days: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          payment_data?: Json | null
          payment_method_id?: string | null
          status?: string | null
          subscription_duration_days: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          payment_data?: Json | null
          payment_method_id?: string | null
          status?: string | null
          subscription_duration_days?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      post_bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          replies_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          replies_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          replies_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          post_id: string
          reason: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          post_id: string
          reason: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          post_id?: string
          reason?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          is_public: boolean | null
          likes_count: number | null
          location: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          media_type: string | null
          media_urls: string[] | null
          media_urls_count: number | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          media_type?: string | null
          media_urls?: string[] | null
          media_urls_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          media_type?: string | null
          media_urls?: string[] | null
          media_urls_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_tokens: {
        Row: {
          batch_id: string | null
          created_at: string | null
          created_by: string
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          token_code: string
          updated_at: string | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          created_by: string
          duration_days: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          token_code: string
          updated_at?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          created_by?: string
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          token_code?: string
          updated_at?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          created_at: string | null
          id: string
          profile_visibility: string | null
          show_activity: boolean | null
          show_catches: boolean | null
          show_followers: boolean | null
          show_following: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_visibility?: string | null
          show_activity?: boolean | null
          show_catches?: boolean | null
          show_followers?: boolean | null
          show_following?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_visibility?: string | null
          show_activity?: boolean | null
          show_catches?: boolean | null
          show_followers?: boolean | null
          show_following?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          fish_caught: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          is_online: boolean | null
          is_private: boolean | null
          last_seen_at: string | null
          location: string | null
          privacy_settings: Json | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          fish_caught?: number | null
          followers_count?: number | null
          following_count?: number | null
          id: string
          is_online?: boolean | null
          is_private?: boolean | null
          last_seen_at?: string | null
          location?: string | null
          privacy_settings?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          fish_caught?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_online?: boolean | null
          is_private?: boolean | null
          last_seen_at?: string | null
          location?: string | null
          privacy_settings?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      prompt_likes: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_likes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          created_at: string | null
          enhanced_prompt: string
          id: string
          is_public: boolean | null
          likes_count: number | null
          original_prompt: string
          prompt_type: string
          quality: string | null
          style: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          enhanced_prompt: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          original_prompt: string
          prompt_type?: string
          quality?: string | null
          style?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          enhanced_prompt?: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          original_prompt?: string
          prompt_type?: string
          quality?: string | null
          style?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      revenue_analytics: {
        Row: {
          churned_premium_users: number | null
          created_at: string | null
          date: string
          failed_payments: number | null
          id: string
          new_premium_users: number | null
          successful_payments: number | null
          total_revenue: number | null
        }
        Insert: {
          churned_premium_users?: number | null
          created_at?: string | null
          date: string
          failed_payments?: number | null
          id?: string
          new_premium_users?: number | null
          successful_payments?: number | null
          total_revenue?: number | null
        }
        Update: {
          churned_premium_users?: number | null
          created_at?: string | null
          date?: string
          failed_payments?: number | null
          id?: string
          new_premium_users?: number | null
          successful_payments?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      species_analysis_usage: {
        Row: {
          analysis_type: string
          api_response: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          quota_used: number | null
          session_fingerprint: string
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analysis_type?: string
          api_response?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quota_used?: number | null
          session_fingerprint: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_type?: string
          api_response?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          quota_used?: number | null
          session_fingerprint?: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          content: string | null
          created_at: string | null
          expires_at: string | null
          highlight_title: string | null
          id: string
          is_highlight: boolean | null
          media_type: string | null
          media_url: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          highlight_title?: string | null
          id?: string
          is_highlight?: boolean | null
          media_type?: string | null
          media_url?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          highlight_title?: string | null
          id?: string
          is_highlight?: boolean | null
          media_type?: string | null
          media_url?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          story_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          plan_type: string
          starts_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type: string
          starts_at?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          starts_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      token_batches: {
        Row: {
          created_at: string | null
          created_by: string
          duration_days: number
          id: string
          purpose: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          duration_days: number
          id?: string
          purpose?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          duration_days?: number
          id?: string
          purpose?: string | null
          quantity?: number
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean | null
          last_typed_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_typing?: boolean | null
          last_typed_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean | null
          last_typed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_type_id: string
          awarded_at: string | null
          awarded_by: string | null
          created_at: string | null
          custom_message: string | null
          id: string
          is_new: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_type_id: string
          awarded_at?: string | null
          awarded_by?: string | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_new?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_type_id?: string
          awarded_at?: string | null
          awarded_by?: string | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_new?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_type_id_fkey"
            columns: ["achievement_type_id"]
            isOneToOne: false
            referencedRelation: "achievement_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_message_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_message_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_message_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_target_message_id_fkey"
            columns: ["target_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          premium_start_date: string | null
          total_chat_messages: number | null
          total_image_uploads: number | null
          total_logins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          premium_start_date?: string | null
          total_chat_messages?: number | null
          total_image_uploads?: number | null
          total_logins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          premium_start_date?: string | null
          total_chat_messages?: number | null
          total_image_uploads?: number | null
          total_logins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string | null
          created_by_admin: string | null
          current_usage: number
          daily_limit: number
          id: string
          is_active: boolean
          key_value: string
          last_reset_at: string | null
          name: string
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by_admin?: string | null
          current_usage?: number
          daily_limit?: number
          id?: string
          is_active?: boolean
          key_value: string
          last_reset_at?: string | null
          name: string
          provider?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by_admin?: string | null
          current_usage?: number
          daily_limit?: number
          id?: string
          is_active?: boolean
          key_value?: string
          last_reset_at?: string | null
          name?: string
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_cooldowns: {
        Row: {
          analysis_type: string
          created_at: string | null
          id: string
          last_analysis_time: string
          next_available_time: string
          user_id: string
        }
        Insert: {
          analysis_type?: string
          created_at?: string | null
          id?: string
          last_analysis_time: string
          next_available_time: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          created_at?: string | null
          id?: string
          last_analysis_time?: string
          next_available_time?: string
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_profile_item_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          item_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          item_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          item_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_item_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "user_profile_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_item_likes: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_item_likes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "user_profile_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_item_views: {
        Row: {
          id: string
          ip_address: string | null
          item_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          item_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          item_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_item_views_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "user_profile_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_items: {
        Row: {
          category: string
          comments_count: number | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          image_url: string | null
          is_private: boolean | null
          likes_count: number | null
          location: string | null
          stats: Json | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          category: string
          comments_count?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          likes_count?: number | null
          location?: string | null
          stats?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          category?: string
          comments_count?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          likes_count?: number | null
          location?: string | null
          stats?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      user_profile_stats: {
        Row: {
          biggest_catch_species: string | null
          biggest_catch_weight: number | null
          created_at: string | null
          favorite_location: string | null
          id: string
          success_rate: number | null
          total_catches: number | null
          total_trips: number | null
          updated_at: string | null
          user_id: string
          years_fishing: number | null
        }
        Insert: {
          biggest_catch_species?: string | null
          biggest_catch_weight?: number | null
          created_at?: string | null
          favorite_location?: string | null
          id?: string
          success_rate?: number | null
          total_catches?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id: string
          years_fishing?: number | null
        }
        Update: {
          biggest_catch_species?: string | null
          biggest_catch_weight?: number | null
          created_at?: string | null
          favorite_location?: string | null
          id?: string
          success_rate?: number | null
          total_catches?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string
          years_fishing?: number | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_app_updates: boolean | null
          notifications_chat_messages: boolean | null
          notifications_enabled: boolean | null
          notifications_new_tips: boolean | null
          notifications_weather_alerts: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_app_updates?: boolean | null
          notifications_chat_messages?: boolean | null
          notifications_enabled?: boolean | null
          notifications_new_tips?: boolean | null
          notifications_weather_alerts?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_app_updates?: boolean | null
          notifications_chat_messages?: boolean | null
          notifications_enabled?: boolean | null
          notifications_new_tips?: boolean | null
          notifications_weather_alerts?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          id: string
          messages_by_type: Json | null
          total_likes_given: number | null
          total_likes_received: number | null
          total_messages: number | null
          total_pins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages_by_type?: Json | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_messages?: number | null
          total_pins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          messages_by_type?: Json | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_messages?: number | null
          total_pins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      payment_analytics: {
        Row: {
          avg_transaction_value: number | null
          failed_payments: number | null
          payment_date: string | null
          pending_payments: number | null
          successful_payments: number | null
          total_revenue: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_admin_by_email: {
        Args: {
          user_email: string
          admin_role_type?: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
      add_user_api_key: {
        Args: {
          target_user_id: string
          key_name: string
          key_value: string
          key_provider?: string
          key_limit?: number
        }
        Returns: undefined
      }
      check_user_analysis_quota: {
        Args: {
          p_user_id?: string
          p_session_fingerprint?: string
          p_ip_address?: string
        }
        Returns: Json
      }
      check_username_availability: {
        Args: { username_input: string }
        Returns: Json
      }
      cleanup_expired_stories: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user_api_key: {
        Args: { key_id: string }
        Returns: undefined
      }
      generate_premium_token: {
        Args: { duration_days: number }
        Returns: string
      }
      generate_premium_token_batch: {
        Args: {
          batch_quantity: number
          duration_days: number
          batch_purpose?: string
        }
        Returns: {
          batch_id: string
          token_codes: string[]
        }[]
      }
      get_active_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_premium_users: number
          total_revenue: number
          monthly_revenue: number
          conversion_rate: number
        }[]
      }
      get_all_users_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          username: string
          display_name: string
          created_at: string
          is_premium: boolean
          is_admin: boolean
        }[]
      }
      get_note_stats_with_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          note_id: string
          views_count: number
          likes_count: number
        }[]
      }
      get_subscription_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_premium_users: number
          active_premium_users: number
          expired_premium_users: number
          revenue_this_month: number
          revenue_total: number
        }[]
      }
      get_user_api_key: {
        Args: { target_user_id?: string }
        Returns: string
      }
      get_user_api_keys: {
        Args: { target_user_id: string }
        Returns: {
          id: string
          name: string
          key_value: string
          provider: string
          daily_limit: number
          current_usage: number
          is_active: boolean
          created_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      increment_api_usage: {
        Args: { api_key_value: string }
        Returns: undefined
      }
      increment_upload_count: {
        Args: { p_user_id: string; p_context: string; p_date?: string }
        Returns: number
      }
      increment_user_api_usage: {
        Args: { target_user_id?: string; api_key_value?: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_user_premium: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      process_premium_payment: {
        Args: { transaction_id: string; payment_status: string }
        Returns: Json
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: Json
      }
      promote_user_to_premium: {
        Args: { target_user_id: string; duration_days: number }
        Returns: Json
      }
      record_analysis_usage: {
        Args: {
          p_user_id?: string
          p_session_fingerprint?: string
          p_ip_address?: string
          p_success?: boolean
          p_api_response?: Json
        }
        Returns: undefined
      }
      redeem_premium_token: {
        Args: { token_code: string }
        Returns: Json
      }
      remove_admin_role: {
        Args: { target_user_id: string }
        Returns: Json
      }
      reset_daily_api_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_user_api_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_user_profile: {
        Args: {
          user_id_input: string
          username_input: string
          email_input: string
        }
        Returns: Json
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_follower_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_user_premium_status: {
        Args: { user_email: string }
        Returns: Json
      }
      update_user_online_status: {
        Args: { user_id: string; is_online: boolean }
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "member"],
    },
  },
} as const
