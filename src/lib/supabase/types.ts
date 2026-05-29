// ============================================================
// MintPrompt — Supabase Database Type Definitions
//
// To regenerate this file from your live Supabase schema:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
//
// Or via the CLI if you have supabase-cli installed:
//   supabase gen types typescript --linked > src/lib/supabase/types.ts
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          slug: string
          image_url: string | null
          description: string | null
          category_id: string | null
          tags: string[]
          ai_models: string[]
          prompt_chatgpt: string | null
          prompt_gemini: string | null
          prompt_grok: string | null
          negative_prompt: string | null
          views: number
          likes: number
          copy_count: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          image_url?: string | null
          description?: string | null
          category_id?: string | null
          tags?: string[]
          ai_models?: string[]
          prompt_chatgpt?: string | null
          prompt_gemini?: string | null
          prompt_grok?: string | null
          negative_prompt?: string | null
          views?: number
          likes?: number
          copy_count?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          image_url?: string | null
          description?: string | null
          category_id?: string | null
          tags?: string[]
          ai_models?: string[]
          prompt_chatgpt?: string | null
          prompt_gemini?: string | null
          prompt_grok?: string | null
          negative_prompt?: string | null
          views?: number
          likes?: number
          copy_count?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      affiliate_links: {
        Row: {
          id: string
          prompt_id: string
          product_name: string
          product_image: string | null
          affiliate_url: string
          platform: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          product_name: string
          product_image?: string | null
          affiliate_url: string
          platform: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          product_name?: string
          product_image?: string | null
          affiliate_url?: string
          platform?: string
          sort_order?: number
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: number
          prompt_id: string | null
          event_type: string
          ai_model: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          prompt_id?: string | null
          event_type: string
          ai_model?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          prompt_id?: string | null
          event_type?: string
          ai_model?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_prompt_counter: {
        Args: { p_id: string; p_field: string }
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
