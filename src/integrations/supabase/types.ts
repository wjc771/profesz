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
      adapted_materials: {
        Row: {
          adaptation_type: string
          adapted_content: string
          created_at: string
          id: string
          is_public: boolean | null
          original_content: string
          target_audience: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adaptation_type: string
          adapted_content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          original_content: string
          target_audience: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adaptation_type?: string
          adapted_content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          original_content?: string
          target_audience?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adapted_materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_tools: {
        Row: {
          content: Json
          created_at: string
          description: string
          id: string
          is_public: boolean | null
          title: string
          tool_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          description: string
          id?: string
          is_public?: boolean | null
          title: string
          tool_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string
          id?: string
          is_public?: boolean | null
          title?: string
          tool_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_tools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          target_audience: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          target_audience: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          target_audience?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_resources: {
        Row: {
          created_at: string
          description: string
          grade_level: string
          id: string
          is_premium: boolean | null
          resource_type: string
          subject: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          grade_level: string
          id?: string
          is_premium?: boolean | null
          resource_type: string
          subject: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          grade_level?: string
          id?: string
          is_premium?: boolean | null
          resource_type?: string
          subject?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      feedback_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          scenario: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          scenario: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          scenario?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          grade_level: string
          id: string
          is_public: boolean | null
          is_template: boolean | null
          subject: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          description?: string | null
          grade_level: string
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          subject: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          grade_level?: string
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          subject?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string
          description: string | null
          feature_name: string
          id: string
          is_enabled: boolean
          plan_id: Database["public"]["Enums"]["subscription_plan_type"]
          updated_at: string
          usage_limit: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean
          plan_id: Database["public"]["Enums"]["subscription_plan_type"]
          updated_at?: string
          usage_limit?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean
          plan_id?: Database["public"]["Enums"]["subscription_plan_type"]
          updated_at?: string
          usage_limit?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          school_name: string | null
          subscription_plan_id:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          school_name?: string | null
          subscription_plan_id?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          school_name?: string | null
          subscription_plan_id?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          answer: string
          created_at: string
          difficulty: string
          explanation: string | null
          grade_level: string
          id: string
          is_public: boolean | null
          options: Json | null
          question_text: string
          subject: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          difficulty: string
          explanation?: string | null
          grade_level: string
          id?: string
          is_public?: boolean | null
          options?: Json | null
          question_text: string
          subject: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          grade_level?: string
          id?: string
          is_public?: boolean | null
          options?: Json | null
          question_text?: string
          subject?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_count: number
          activity_type: string
          created_at: string
          id: string
          last_activity_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_count?: number
          activity_type: string
          created_at?: string
          id?: string
          last_activity_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_count?: number
          activity_type?: string
          created_at?: string
          id?: string
          last_activity_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_plan_type:
        | "inicial"
        | "essencial"
        | "maestro"
        | "institucional"
      user_type: "professor" | "instituicao"
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
    Enums: {
      subscription_plan_type: [
        "inicial",
        "essencial",
        "maestro",
        "institucional",
      ],
      user_type: ["professor", "instituicao"],
    },
  },
} as const
