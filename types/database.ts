export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      daily_entries: {
        Row: {
          abdomen_status: "distended" | "normal" | "tight";
          breathing_status: "difficult" | "normal";
          created_at: string;
          day_name: string;
          diastolic: number;
          entry_date: string;
          id: string;
          leg_swelling: "mild" | "none" | "yes";
          notes: string | null;
          overall_status: "needs_attention" | "stable";
          patient_id: string;
          pulse: number;
          systolic: number;
          updated_at: string;
          weight: number;
        };
        Insert: {
          abdomen_status: "distended" | "normal" | "tight";
          breathing_status: "difficult" | "normal";
          created_at?: string;
          day_name: string;
          diastolic: number;
          entry_date: string;
          id?: string;
          leg_swelling: "mild" | "none" | "yes";
          notes?: string | null;
          overall_status?: "needs_attention" | "stable";
          patient_id: string;
          pulse: number;
          systolic: number;
          updated_at?: string;
          weight: number;
        };
        Update: {
          abdomen_status?: "distended" | "normal" | "tight";
          breathing_status?: "difficult" | "normal";
          created_at?: string;
          day_name?: string;
          diastolic?: number;
          entry_date?: string;
          id?: string;
          leg_swelling?: "mild" | "none" | "yes";
          notes?: string | null;
          overall_status?: "needs_attention" | "stable";
          patient_id?: string;
          pulse?: number;
          systolic?: number;
          updated_at?: string;
          weight?: number;
        };
        Relationships: [
          {
            columns: ["patient_id"];
            foreignKeyName: "daily_entries_patient_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "patients";
          },
        ];
      };
      medications: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          patient_id: string;
          reminder_time: string | null;
          tablets_per_day: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          patient_id: string;
          reminder_time?: string | null;
          tablets_per_day: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          patient_id?: string;
          reminder_time?: string | null;
          tablets_per_day?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["patient_id"];
            foreignKeyName: "medications_patient_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "patients";
          },
        ];
      };
      patients: {
        Row: {
          birth_date: string | null;
          created_at: string;
          doctor_name: string | null;
          full_name: string;
          gender: "female" | "male" | null;
          hospital_name: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          birth_date?: string | null;
          created_at?: string;
          doctor_name?: string | null;
          full_name: string;
          gender?: "female" | "male" | null;
          hospital_name?: string | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          birth_date?: string | null;
          created_at?: string;
          doctor_name?: string | null;
          full_name?: string;
          gender?: "female" | "male" | null;
          hospital_name?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "patients_user_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          locale: "ar" | "en" | "tr";
          role: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          locale?: "ar" | "en" | "tr";
          role?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          locale?: "ar" | "en" | "tr";
          role?: string;
        };
        Relationships: [
          {
            columns: ["id"];
            foreignKeyName: "profiles_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
