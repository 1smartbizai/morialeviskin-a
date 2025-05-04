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
      business_owners: {
        Row: {
          accent_color: string | null
          business_name: string
          created_at: string
          first_name: string
          google_calendar_connected: boolean | null
          id: string
          last_name: string
          logo_url: string | null
          phone: string
          primary_color: string | null
          subscription_active: boolean | null
          subscription_end_date: string | null
          subscription_level: string | null
          updated_at: string
          user_id: string
          working_hours: Json | null
        }
        Insert: {
          accent_color?: string | null
          business_name: string
          created_at?: string
          first_name: string
          google_calendar_connected?: boolean | null
          id?: string
          last_name: string
          logo_url?: string | null
          phone: string
          primary_color?: string | null
          subscription_active?: boolean | null
          subscription_end_date?: string | null
          subscription_level?: string | null
          updated_at?: string
          user_id: string
          working_hours?: Json | null
        }
        Update: {
          accent_color?: string | null
          business_name?: string
          created_at?: string
          first_name?: string
          google_calendar_connected?: boolean | null
          id?: string
          last_name?: string
          logo_url?: string | null
          phone?: string
          primary_color?: string | null
          subscription_active?: boolean | null
          subscription_end_date?: string | null
          subscription_level?: string | null
          updated_at?: string
          user_id?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          birthdate: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          marketing_consent: boolean | null
          phone: string
          photo_url: string | null
          skin_goals: string | null
          status: string | null
          terms_accepted: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          marketing_consent?: boolean | null
          phone: string
          photo_url?: string | null
          skin_goals?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          marketing_consent?: boolean | null
          phone?: string
          photo_url?: string | null
          skin_goals?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          in_stock: boolean | null
          is_visible: boolean | null
          name: string
          price: number
          sku: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          in_stock?: boolean | null
          is_visible?: boolean | null
          name: string
          price: number
          sku?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          in_stock?: boolean | null
          is_visible?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      treatment_plan_treatments: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          treatment_id: string | null
          treatment_plan_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          treatment_id?: string | null
          treatment_plan_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          treatment_id?: string | null
          treatment_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plan_treatments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_plan_treatments_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_visible: boolean | null
          name: string
          price: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean | null
          name: string
          price?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      treatment_product_recommendations: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          treatment_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          treatment_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_product_recommendations_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_visible: boolean | null
          name: string
          price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_visible?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_visible?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          user_id?: string
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
