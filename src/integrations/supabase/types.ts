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
      profiles: {
        Row: {
          agency_name: string | null
          avatar_url: string | null
          created_at: string
          creci: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          subscription_plan_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          agency_name?: string | null
          avatar_url?: string | null
          created_at?: string
          creci?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          subscription_plan_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          agency_name?: string | null
          avatar_url?: string | null
          created_at?: string
          creci?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          subscription_plan_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          city: string
          condominium: number | null
          created_at: string
          description: string
          has_balcony: boolean | null
          has_elevator: boolean | null
          has_gym: boolean | null
          has_pool: boolean | null
          id: string
          images: string[] | null
          is_active: boolean
          is_furnished: boolean | null
          is_premium: boolean
          lat: number | null
          lng: number | null
          neighborhood: string
          owner_id: string
          parking_spaces: number
          pets_allowed: boolean | null
          price: number
          property_tax: number | null
          state: string
          title: string
          transaction_type: string
          type: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          city: string
          condominium?: number | null
          created_at?: string
          description: string
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_furnished?: boolean | null
          is_premium?: boolean
          lat?: number | null
          lng?: number | null
          neighborhood: string
          owner_id: string
          parking_spaces: number
          pets_allowed?: boolean | null
          price: number
          property_tax?: number | null
          state: string
          title: string
          transaction_type: string
          type: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address?: string
          area?: number
          bathrooms?: number
          bedrooms?: number
          city?: string
          condominium?: number | null
          created_at?: string
          description?: string
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_furnished?: boolean | null
          is_premium?: boolean
          lat?: number | null
          lng?: number | null
          neighborhood?: string
          owner_id?: string
          parking_spaces?: number
          pets_allowed?: boolean | null
          price?: number
          property_tax?: number | null
          state?: string
          title?: string
          transaction_type?: string
          type?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      property_demands: {
        Row: {
          cities: string[]
          created_at: string
          has_balcony: boolean | null
          has_elevator: boolean | null
          has_gym: boolean | null
          has_pool: boolean | null
          id: string
          is_active: boolean
          is_furnished: boolean | null
          max_price: number
          min_area: number | null
          min_bathrooms: number | null
          min_bedrooms: number | null
          min_parking_spaces: number | null
          min_price: number
          neighborhoods: string[] | null
          pets_allowed: boolean | null
          property_types: string[]
          states: string[]
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cities: string[]
          created_at?: string
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          is_active?: boolean
          is_furnished?: boolean | null
          max_price: number
          min_area?: number | null
          min_bathrooms?: number | null
          min_bedrooms?: number | null
          min_parking_spaces?: number | null
          min_price: number
          neighborhoods?: string[] | null
          pets_allowed?: boolean | null
          property_types: string[]
          states: string[]
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cities?: string[]
          created_at?: string
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          is_active?: boolean
          is_furnished?: boolean | null
          max_price?: number
          min_area?: number | null
          min_bathrooms?: number | null
          min_bedrooms?: number | null
          min_parking_spaces?: number | null
          min_price?: number
          neighborhoods?: string[] | null
          pets_allowed?: boolean | null
          property_types?: string[]
          states?: string[]
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_matches: {
        Row: {
          contacted: boolean
          created_at: string
          demand_id: string
          id: string
          property_id: string | null
          score: number
          viewed: boolean
        }
        Insert: {
          contacted?: boolean
          created_at?: string
          demand_id: string
          id?: string
          property_id?: string | null
          score: number
          viewed?: boolean
        }
        Update: {
          contacted?: boolean
          created_at?: string
          demand_id?: string
          id?: string
          property_id?: string | null
          score?: number
          viewed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "property_matches_demand_id_fkey"
            columns: ["demand_id"]
            isOneToOne: false
            referencedRelation: "property_demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_matches_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
