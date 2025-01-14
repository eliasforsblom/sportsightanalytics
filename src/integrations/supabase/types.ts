export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          id: string
          last_visit: string | null
          page_path: string
          visit_date: string
          visitor_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_visit?: string | null
          page_path: string
          visit_date?: string
          visitor_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_visit?: string | null
          page_path?: string
          visit_date?: string
          visitor_count?: number | null
        }
        Relationships: []
      }
      post_views: {
        Row: {
          id: string
          page_path: string
          post_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          page_path: string
          post_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          page_path?: string
          post_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string
          content: string
          created_at: string | null
          excerpt: string
          highlighted: boolean | null
          id: string
          image_url: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          excerpt: string
          highlighted?: boolean | null
          id?: string
          image_url: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          highlighted?: boolean | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      referrer_analytics: {
        Row: {
          created_at: string | null
          id: string
          last_visit: string | null
          referrer_domain: string
          visit_date: string
          visitor_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_visit?: string | null
          referrer_domain: string
          visit_date?: string
          visitor_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_visit?: string | null
          referrer_domain?: string
          visit_date?: string
          visitor_count?: number | null
        }
        Relationships: []
      }
      season_data: {
        Row: {
          avgfee: number | null
          cpi: number | null
          rank: number | null
          season: string | null
        }
        Insert: {
          avgfee?: number | null
          cpi?: number | null
          rank?: number | null
          season?: string | null
        }
        Update: {
          avgfee?: number | null
          cpi?: number | null
          rank?: number | null
          season?: string | null
        }
        Relationships: []
      }
      viewer_locations: {
        Row: {
          city: string | null
          country: string
          created_at: string | null
          id: string
          visit_date: string
          visitor_count: number | null
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string | null
          id?: string
          visit_date?: string
          visitor_count?: number | null
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string | null
          id?: string
          visit_date?: string
          visitor_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
