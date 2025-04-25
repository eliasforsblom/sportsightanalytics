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
          visit_date: string
          visitor_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          visit_date?: string
          visitor_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          visit_date?: string
          visitor_count?: number
        }
        Relationships: []
      }
      Fixtures: {
        Row: {
          Date: string | null
          Goal1: string | null
          Goal2: number | null
          ID: string
          Points: string | null
          Points_weight: string | null
          Result: string | null
          Team1: string | null
          Team2: string
          Weight: number | null
        }
        Insert: {
          Date?: string | null
          Goal1?: string | null
          Goal2?: number | null
          ID: string
          Points?: string | null
          Points_weight?: string | null
          Result?: string | null
          Team1?: string | null
          Team2: string
          Weight?: number | null
        }
        Update: {
          Date?: string | null
          Goal1?: string | null
          Goal2?: number | null
          ID?: string
          Points?: string | null
          Points_weight?: string | null
          Result?: string | null
          Team1?: string | null
          Team2?: string
          Weight?: number | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_goals: number
          away_team_id: string
          created_at: string | null
          home_goals: number
          home_team_id: string
          id: string
          match_date: string
        }
        Insert: {
          away_goals: number
          away_team_id: string
          created_at?: string | null
          home_goals: number
          home_team_id: string
          id?: string
          match_date: string
        }
        Update: {
          away_goals?: number
          away_team_id?: string
          created_at?: string | null
          home_goals?: number
          home_team_id?: string
          id?: string
          match_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      post_translations: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string
          id: string
          language: string
          post_id: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          language: string
          post_id: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          language?: string
          post_id?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_translations_post_id_fkey"
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
          draft: boolean | null
          excerpt: string
          highlighted: boolean | null
          id: string
          image_url: string
          title: string
          updated_at: string | null
          video_url: string | null
          views: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          draft?: boolean | null
          excerpt: string
          highlighted?: boolean | null
          id?: string
          image_url: string
          title: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          draft?: boolean | null
          excerpt?: string
          highlighted?: boolean | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
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
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
