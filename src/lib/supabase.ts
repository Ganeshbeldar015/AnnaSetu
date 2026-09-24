import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid Supabase configuration is present
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    supabaseUrl.startsWith('http') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 20 &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Initialize Supabase Client
// If keys are not yet configured, create a safe fallback client or null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Database Types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string;
          role: 'farmer' | 'operator' | 'admin';
          kisan_card_id?: string;
          employee_id?: string;
          assigned_center?: string;
          state?: string;
          district?: string;
          village?: string;
          land_survey_no?: string;
          land_acreage?: number;
          bank_name?: string;
          account_masked?: string;
          ifsc_code?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      booking_tokens: {
        Row: {
          id: string;
          token_number: string;
          farmer_id: string;
          farmer_name: string;
          farmer_phone: string;
          farmer_village?: string;
          farmer_district?: string;
          center_id: string;
          center_name: string;
          crop_id: string;
          crop_name: string;
          expected_quantity_quintals: number;
          actual_quantity_quintals?: number;
          date: string;
          time_slot: string;
          stage: string;
          queue_position: number;
          estimated_wait_minutes: number;
          counter_assigned?: string;
          booked_at: string;
          checked_in_at?: string;
          called_at?: string;
          completed_at?: string;
          qr_token_payload: string;
        };
        Insert: Omit<Database['public']['Tables']['booking_tokens']['Row'], 'id' | 'booked_at'>;
        Update: Partial<Database['public']['Tables']['booking_tokens']['Insert']>;
      };
      qc_inspections: {
        Row: {
          id: string;
          token_id: string;
          moisture_percent: number;
          foreign_matter_percent: number;
          broken_grains_percent: number;
          grade: string;
          base_msp_rate: number;
          moisture_deduction_rate: number;
          net_rate_per_quintal: number;
          actual_quantity_quintals: number;
          gross_amount: number;
          deductions_amount: number;
          net_payable_amount: number;
          inspector_name: string;
          counter_number: string;
          weighment_slip_no: string;
          inspected_at: string;
        };
        Insert: Omit<Database['public']['Tables']['qc_inspections']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['qc_inspections']['Insert']>;
      };
      payments: {
        Row: {
          payment_id: string;
          token_id: string;
          utr_number: string;
          amount: number;
          status: string;
          bank_name: string;
          account_masked: string;
          ifsc_code: string;
          pfms_reference: string;
          initiated_at: string;
          credited_at?: string;
        };
        Insert: Database['public']['Tables']['payments']['Row'];
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      procurement_centers: {
        Row: {
          id: string;
          name: string;
          code: string;
          district: string;
          state: string;
          address: string;
          distance_km: number;
          latitude: number;
          longitude: number;
          total_counters: number;
          active_counters: number;
          daily_capacity_quintals: number;
          daily_procured_quintals: number;
          current_queue_count: number;
          avg_wait_time_minutes: number;
          load_status: string;
          contact_person: string;
          contact_phone: string;
        };
        Insert: Database['public']['Tables']['procurement_centers']['Row'];
        Update: Partial<Database['public']['Tables']['procurement_centers']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          actor_name: string;
          actor_role: string;
          action: string;
          details: string;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'timestamp'>;
      };
    };
  };
}
