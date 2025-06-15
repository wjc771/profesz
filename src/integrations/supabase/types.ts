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
      answer_keys: {
        Row: {
          answers: Json
          created_at: string
          essay_criteria: Json | null
          id: string
          subject: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          essay_criteria?: Json | null
          id?: string
          subject: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          essay_criteria?: Json | null
          id?: string
          subject?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bncc_anos_escolares: {
        Row: {
          codigo: string
          created_at: string
          etapa: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          codigo: string
          created_at?: string
          etapa: string
          id?: string
          nome: string
          ordem: number
        }
        Update: {
          codigo?: string
          created_at?: string
          etapa?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      bncc_areas_conhecimento: {
        Row: {
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      bncc_componentes: {
        Row: {
          area_id: string | null
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          area_id?: string | null
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          area_id?: string | null
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "bncc_componentes_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "bncc_areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      bncc_habilidades: {
        Row: {
          codigo: string
          created_at: string
          descricao: string
          id: string
          objeto_conhecimento_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao: string
          id?: string
          objeto_conhecimento_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string
          id?: string
          objeto_conhecimento_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bncc_habilidades_objeto_conhecimento_id_fkey"
            columns: ["objeto_conhecimento_id"]
            isOneToOne: false
            referencedRelation: "bncc_objetos_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      bncc_objetos_conhecimento: {
        Row: {
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          unidade_tematica_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          unidade_tematica_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          unidade_tematica_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bncc_objetos_conhecimento_unidade_tematica_id_fkey"
            columns: ["unidade_tematica_id"]
            isOneToOne: false
            referencedRelation: "bncc_unidades_tematicas"
            referencedColumns: ["id"]
          },
        ]
      }
      bncc_unidades_tematicas: {
        Row: {
          ano_escolar_id: string | null
          codigo: string
          componente_id: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ano_escolar_id?: string | null
          codigo: string
          componente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ano_escolar_id?: string | null
          codigo?: string
          componente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "bncc_unidades_tematicas_ano_escolar_id_fkey"
            columns: ["ano_escolar_id"]
            isOneToOne: false
            referencedRelation: "bncc_anos_escolares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bncc_unidades_tematicas_componente_id_fkey"
            columns: ["componente_id"]
            isOneToOne: false
            referencedRelation: "bncc_componentes"
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
      correction_uploads: {
        Row: {
          correction_id: string
          created_at: string
          file_type: string
          file_url: string
          id: string
          ocr_text: string | null
          processing_status: string
        }
        Insert: {
          correction_id: string
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          ocr_text?: string | null
          processing_status?: string
        }
        Update: {
          correction_id?: string
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          ocr_text?: string | null
          processing_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "correction_uploads_correction_id_fkey"
            columns: ["correction_id"]
            isOneToOne: false
            referencedRelation: "corrections"
            referencedColumns: ["id"]
          },
        ]
      }
      corrections: {
        Row: {
          ai_feedback: Json | null
          correction_results: Json | null
          created_at: string
          evaluation_type: string
          id: string
          max_score: number | null
          ocr_results: Json | null
          processed_images: Json | null
          score: number | null
          status: string
          title: string
          total_questions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          correction_results?: Json | null
          created_at?: string
          evaluation_type?: string
          id?: string
          max_score?: number | null
          ocr_results?: Json | null
          processed_images?: Json | null
          score?: number | null
          status?: string
          title: string
          total_questions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          correction_results?: Json | null
          created_at?: string
          evaluation_type?: string
          id?: string
          max_score?: number | null
          ocr_results?: Json | null
          processed_images?: Json | null
          score?: number | null
          status?: string
          title?: string
          total_questions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          onboarding_completed_at: string | null
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
          onboarding_completed_at?: string | null
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
          onboarding_completed_at?: string | null
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
      user_preferences: {
        Row: {
          child_grade: string | null
          child_name: string | null
          created_at: string
          experience: string | null
          frequency: string | null
          goals: string[] | null
          grade_level: string | null
          id: string
          institution_type: string | null
          subjects: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          child_grade?: string | null
          child_name?: string | null
          created_at?: string
          experience?: string | null
          frequency?: string | null
          goals?: string[] | null
          grade_level?: string | null
          id?: string
          institution_type?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          child_grade?: string | null
          child_name?: string | null
          created_at?: string
          experience?: string | null
          frequency?: string | null
          goals?: string[] | null
          grade_level?: string | null
          id?: string
          institution_type?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      increment_user_activity: {
        Args: { user_id: string; activity_type: string }
        Returns: {
          activity_count: number
          activity_type: string
          created_at: string
          id: string
          last_activity_at: string
          updated_at: string
          user_id: string
        }[]
      }
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
