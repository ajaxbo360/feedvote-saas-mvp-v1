export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      feedback: {
        Row: {
          id: string;
          created_at: string;
          project_id: string;
          title: string;
          description: string;
          status: 'Open' | 'In Progress' | 'Done';
          votes: number;
          tags?: string[];
          attachment_url?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          project_id: string;
          title: string;
          description: string;
          status?: 'Open' | 'In Progress' | 'Done';
          votes?: number;
          tags?: string[];
          attachment_url?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          project_id?: string;
          title?: string;
          description?: string;
          status?: 'Open' | 'In Progress' | 'Done';
          votes?: number;
          tags?: string[];
          attachment_url?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          slug: string;
          branding_colors?: {
            primary: string;
            secondary: string;
          };
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          slug: string;
          branding_colors?: {
            primary: string;
            secondary: string;
          };
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          slug?: string;
          branding_colors?: {
            primary: string;
            secondary: string;
          };
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
