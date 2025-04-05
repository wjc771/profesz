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
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
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
