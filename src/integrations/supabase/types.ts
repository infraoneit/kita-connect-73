export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      absences: {
        Row: {
          child_id: string
          created_at: string
          end_date: string
          id: string
          note: string | null
          reported_by: string | null
          start_date: string
          type: Database["public"]["Enums"]["absence_type"]
        }
        Insert: {
          child_id: string
          created_at?: string
          end_date: string
          id?: string
          note?: string | null
          reported_by?: string | null
          start_date: string
          type: Database["public"]["Enums"]["absence_type"]
        }
        Update: {
          child_id?: string
          created_at?: string
          end_date?: string
          id?: string
          note?: string | null
          reported_by?: string | null
          start_date?: string
          type?: Database["public"]["Enums"]["absence_type"]
        }
        Relationships: [
          {
            foreignKeyName: "absences_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_groups: {
        Row: {
          announcement_id: string
          group_id: string
          id: string
        }
        Insert: {
          announcement_id: string
          group_id: string
          id?: string
        }
        Update: {
          announcement_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_groups_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          important: boolean | null
          published_at: string | null
          title: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          id?: string
          important?: boolean | null
          published_at?: string | null
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          important?: boolean | null
          published_at?: string | null
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          child_id: string
          created_at: string
          date: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          child_id: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          all_day?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date: string
          title: string
          type?: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          all_day?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: []
      }
      child_bookings: {
        Row: {
          child_id: string
          contract_id: string | null
          created_at: string
          date: string
          end_time: string
          group_id: string | null
          id: string
          is_extra: boolean | null
          notes: string | null
          start_time: string
        }
        Insert: {
          child_id: string
          contract_id?: string | null
          created_at?: string
          date: string
          end_time: string
          group_id?: string | null
          id?: string
          is_extra?: boolean | null
          notes?: string | null
          start_time: string
        }
        Update: {
          child_id?: string
          contract_id?: string | null
          created_at?: string
          date?: string
          end_time?: string
          group_id?: string | null
          id?: string
          is_extra?: boolean | null
          notes?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_bookings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_bookings_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_bookings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      child_guardians: {
        Row: {
          can_pickup: boolean | null
          child_id: string
          created_at: string
          guardian_id: string
          id: string
          is_emergency_contact: boolean | null
          phone: string | null
          relationship: string
        }
        Insert: {
          can_pickup?: boolean | null
          child_id: string
          created_at?: string
          guardian_id: string
          id?: string
          is_emergency_contact?: boolean | null
          phone?: string | null
          relationship?: string
        }
        Update: {
          can_pickup?: boolean | null
          child_id?: string
          created_at?: string
          guardian_id?: string
          id?: string
          is_emergency_contact?: boolean | null
          phone?: string | null
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_guardians_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_guardians_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          birth_date: string
          created_at: string
          first_name: string
          group_id: string | null
          id: string
          last_name: string
          photo_permission: boolean | null
          primary_guardian_id: string | null
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date: string
          created_at?: string
          first_name: string
          group_id?: string | null
          id?: string
          last_name: string
          photo_permission?: boolean | null
          primary_guardian_id?: string | null
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date?: string
          created_at?: string
          first_name?: string
          group_id?: string | null
          id?: string
          last_name?: string
          photo_permission?: boolean | null
          primary_guardian_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_primary_guardian_id_fkey"
            columns: ["primary_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_booking_times: {
        Row: {
          contract_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          contract_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          contract_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "contract_booking_times_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          additional_fees: number | null
          child_id: string
          contract_number: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          discount_percent: number | null
          end_date: string | null
          guardian_id: string
          id: string
          meal_fee: number | null
          monthly_fee: number | null
          notes: string | null
          special_agreements: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          subsidy_amount: number | null
          termination_notice_period: number | null
          updated_at: string
        }
        Insert: {
          additional_fees?: number | null
          child_id: string
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          discount_percent?: number | null
          end_date?: string | null
          guardian_id: string
          id?: string
          meal_fee?: number | null
          monthly_fee?: number | null
          notes?: string | null
          special_agreements?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          subsidy_amount?: number | null
          termination_notice_period?: number | null
          updated_at?: string
        }
        Update: {
          additional_fees?: number | null
          child_id?: string
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          discount_percent?: number | null
          end_date?: string | null
          guardian_id?: string
          id?: string
          meal_fee?: number | null
          monthly_fee?: number | null
          notes?: string | null
          special_agreements?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          subsidy_amount?: number | null
          termination_notice_period?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          profile_id: string
          unread_count: number | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          profile_id: string
          unread_count?: number | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          type?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          author: string
          content: string
          created_at: string
          date: string
          group_id: string
          id: string
          photos: string[] | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          date?: string
          group_id: string
          id?: string
          photos?: string[] | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          date?: string
          group_id?: string
          id?: string
          photos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          announcement_id: string | null
          created_at: string
          file_type: string | null
          file_url: string
          id: string
          name: string
        }
        Insert: {
          announcement_id?: string | null
          created_at?: string
          file_type?: string | null
          file_url: string
          id?: string
          name: string
        }
        Update: {
          announcement_id?: string | null
          created_at?: string
          file_type?: string | null
          file_url?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      event_groups: {
        Row: {
          event_id: string
          group_id: string
          id: string
        }
        Insert: {
          event_id: string
          group_id: string
          id?: string
        }
        Update: {
          event_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_educators: {
        Row: {
          created_at: string
          educator_id: string
          group_id: string
          id: string
        }
        Insert: {
          created_at?: string
          educator_id: string
          group_id: string
          id?: string
        }
        Update: {
          created_at?: string
          educator_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_educators_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_educators_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      guardians: {
        Row: {
          address_city: string | null
          address_street: string | null
          address_zip: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          phone_secondary: string | null
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_street?: string | null
          address_zip?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          phone_secondary?: string | null
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_street?: string | null
          address_zip?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          phone_secondary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          employment_end: string | null
          employment_start: string | null
          first_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          last_name: string
          notes: string | null
          phone: string | null
          position: string | null
          profile_id: string | null
          updated_at: string
          weekly_hours: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          employment_end?: string | null
          employment_start?: string | null
          first_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          updated_at?: string
          weekly_hours?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          employment_end?: string | null
          employment_start?: string | null
          first_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          updated_at?: string
          weekly_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_group_assignments: {
        Row: {
          created_at: string
          group_id: string
          id: string
          is_primary: boolean | null
          staff_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          is_primary?: boolean | null
          staff_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          is_primary?: boolean | null
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_group_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_group_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_leave: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          notes: string | null
          staff_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          notes?: string | null
          staff_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          notes?: string | null
          staff_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_leave_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_leave_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_shifts: {
        Row: {
          break_minutes: number | null
          created_at: string
          date: string
          end_time: string
          group_id: string | null
          id: string
          notes: string | null
          shift_type: Database["public"]["Enums"]["staff_shift_type"]
          staff_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          break_minutes?: number | null
          created_at?: string
          date: string
          end_time: string
          group_id?: string | null
          id?: string
          notes?: string | null
          shift_type?: Database["public"]["Enums"]["staff_shift_type"]
          staff_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          break_minutes?: number | null
          created_at?: string
          date?: string
          end_time?: string
          group_id?: string | null
          id?: string
          notes?: string | null
          shift_type?: Database["public"]["Enums"]["staff_shift_type"]
          staff_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_shifts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_child: { Args: { _child_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conversation_id: string }
        Returns: boolean
      }
      is_educator_of_group: { Args: { _group_id: string }; Returns: boolean }
      is_manager_or_admin: { Args: never; Returns: boolean }
      is_parent_of_child: { Args: { _child_id: string }; Returns: boolean }
    }
    Enums: {
      absence_type: "sick" | "vacation" | "late" | "early_pickup" | "other"
      app_role: "parent" | "educator" | "manager" | "admin"
      attendance_status: "present" | "absent" | "late" | "not_arrived"
      contract_status: "active" | "pending" | "terminated" | "expired"
      contract_type: "flexible" | "halbtags" | "ganztags" | "stundenweise"
      event_type: "event" | "closure" | "meeting" | "reminder"
      leave_type: "vacation" | "sick" | "training" | "other"
      staff_shift_type: "morning" | "afternoon" | "full_day" | "custom"
      weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
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
      absence_type: ["sick", "vacation", "late", "early_pickup", "other"],
      app_role: ["parent", "educator", "manager", "admin"],
      attendance_status: ["present", "absent", "late", "not_arrived"],
      contract_status: ["active", "pending", "terminated", "expired"],
      contract_type: ["flexible", "halbtags", "ganztags", "stundenweise"],
      event_type: ["event", "closure", "meeting", "reminder"],
      leave_type: ["vacation", "sick", "training", "other"],
      staff_shift_type: ["morning", "afternoon", "full_day", "custom"],
      weekday: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  },
} as const
