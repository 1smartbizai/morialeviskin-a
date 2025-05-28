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
      appointments: {
        Row: {
          appointment_date: string
          attachments: Json | null
          business_owner_id: string
          cancelled_at: string | null
          cancelled_reason: string | null
          client_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          status: string
          therapist_notes: string | null
          treatment_id: string | null
          treatment_name: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          attachments?: Json | null
          business_owner_id: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          client_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          status?: string
          therapist_notes?: string | null
          treatment_id?: string | null
          treatment_name: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          attachments?: Json | null
          business_owner_id?: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          client_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          status?: string
          therapist_notes?: string | null
          treatment_id?: string | null
          treatment_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_owner_id_fkey"
            columns: ["business_owner_id"]
            isOneToOne: false
            referencedRelation: "business_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      available_timeslots: {
        Row: {
          business_owner_id: string
          created_at: string
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          updated_at: string
        }
        Insert: {
          business_owner_id: string
          created_at?: string
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          updated_at?: string
        }
        Update: {
          business_owner_id?: string
          created_at?: string
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_timeslots_business_owner_id_fkey"
            columns: ["business_owner_id"]
            isOneToOne: false
            referencedRelation: "business_owners"
            referencedColumns: ["id"]
          },
        ]
      }
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
          metadata: Json | null
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
          metadata?: Json | null
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
          metadata?: Json | null
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
      client_automated_actions: {
        Row: {
          action_type: string
          client_id: string
          content: string | null
          created_at: string
          executed_at: string | null
          id: string
          scheduled_for: string | null
          source_id: string
          source_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          client_id: string
          content?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          scheduled_for?: string | null
          source_id: string
          source_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          client_id?: string
          content?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          scheduled_for?: string | null
          source_id?: string
          source_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_automated_actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_emotional_logs: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          sentiment: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          sentiment?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          sentiment?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_emotional_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_feedback: {
        Row: {
          additional_comments: string | null
          business_owner_id: string
          client_id: string
          created_at: string
          id: string
          overall_satisfaction: number
          staff_friendliness: number
          treatment_effectiveness: number
        }
        Insert: {
          additional_comments?: string | null
          business_owner_id: string
          client_id: string
          created_at?: string
          id?: string
          overall_satisfaction: number
          staff_friendliness: number
          treatment_effectiveness: number
        }
        Update: {
          additional_comments?: string | null
          business_owner_id?: string
          client_id?: string
          created_at?: string
          id?: string
          overall_satisfaction?: number
          staff_friendliness?: number
          treatment_effectiveness?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_feedback_business_owner_id_fkey"
            columns: ["business_owner_id"]
            isOneToOne: false
            referencedRelation: "business_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_feedback_dismissals: {
        Row: {
          client_id: string
          created_at: string
          id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_feedback_dismissals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_loyalty: {
        Row: {
          client_id: string
          created_at: string
          id: string
          total_points: number
          total_spent: number
          updated_at: string
          user_id: string
          visits_count: number
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          total_points?: number
          total_spent?: number
          updated_at?: string
          user_id: string
          visits_count?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          total_points?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
          visits_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_loyalty_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_product_suggestions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          product_id: string
          reason: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          product_id: string
          reason: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          product_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_product_suggestions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_product_suggestions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      client_risk_assessments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_action_date: string | null
          reasons: string[] | null
          risk_score: number
          status: string | null
          suggested_actions: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_action_date?: string | null
          reasons?: string[] | null
          risk_score: number
          status?: string | null
          suggested_actions?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_action_date?: string | null
          reasons?: string[] | null
          risk_score?: number
          status?: string | null
          suggested_actions?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_risk_assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_skin_answers: {
        Row: {
          answer: string
          answered_at: string
          client_id: string
          id: string
          question_id: string
        }
        Insert: {
          answer: string
          answered_at?: string
          client_id: string
          id?: string
          question_id: string
        }
        Update: {
          answer?: string
          answered_at?: string
          client_id?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_skin_answers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_skin_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "skin_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_skin_attributes: {
        Row: {
          attribute: string
          category: string
          client_id: string
          confidence: number
          created_at: string
          id: string
          updated_at: string
          value: string
        }
        Insert: {
          attribute: string
          category: string
          client_id: string
          confidence?: number
          created_at?: string
          id?: string
          updated_at?: string
          value: string
        }
        Update: {
          attribute?: string
          category?: string
          client_id?: string
          confidence?: number
          created_at?: string
          id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_skin_attributes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_treatment_suggestions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          reason: string
          treatment_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          reason: string
          treatment_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          reason?: string
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_treatment_suggestions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_treatment_suggestions_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          birthdate: string | null
          communication_preferences: Json | null
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
          communication_preferences?: Json | null
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
          communication_preferences?: Json | null
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
      loyalty_rewards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          point_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          point_cost: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          point_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          reward_type: string
          reward_value: number
          rule_type: string
          threshold: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_type: string
          reward_value: number
          rule_type: string
          threshold: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_type?: string
          reward_value?: number
          rule_type?: string
          threshold?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          points: number
          source: string
          source_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          points: number
          source: string
          source_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          source?: string
          source_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_goals: {
        Row: {
          created_at: string
          current_new_clients: number
          current_revenue: number
          id: string
          month_year: string
          new_clients_goal: number
          revenue_goal: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_new_clients?: number
          current_revenue?: number
          id?: string
          month_year: string
          new_clients_goal?: number
          revenue_goal?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_new_clients?: number
          current_revenue?: number
          id?: string
          month_year?: string
          new_clients_goal?: number
          revenue_goal?: number
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
      redeemed_rewards: {
        Row: {
          client_id: string
          created_at: string
          id: string
          loyalty_reward_id: string
          points_used: number
          redeemed_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          loyalty_reward_id: string
          points_used: number
          redeemed_at?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          loyalty_reward_id?: string
          points_used?: number
          redeemed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redeemed_rewards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeemed_rewards_loyalty_reward_id_fkey"
            columns: ["loyalty_reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          options: string[] | null
          order: number
          question: string
          question_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          options?: string[] | null
          order?: number
          question: string
          question_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          options?: string[] | null
          order?: number
          question?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      smart_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          related_id: string | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          related_id?: string | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          related_id?: string | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      system_status: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          last_checked: string
          service_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          last_checked?: string
          service_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          last_checked?: string
          service_name?: string
          status?: string
          updated_at?: string
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
      user_preferences: {
        Row: {
          created_at: string
          daily_motivation: boolean | null
          dark_mode: boolean | null
          dashboard_layout: string | null
          id: string
          notifications_enabled: boolean | null
          updated_at: string
          user_id: string
          widget_order: Json | null
        }
        Insert: {
          created_at?: string
          daily_motivation?: boolean | null
          dark_mode?: boolean | null
          dashboard_layout?: string | null
          id?: string
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id: string
          widget_order?: Json | null
        }
        Update: {
          created_at?: string
          daily_motivation?: boolean | null
          dark_mode?: boolean | null
          dashboard_layout?: string | null
          id?: string
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          widget_order?: Json | null
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
