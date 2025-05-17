export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id'>>;
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          email: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          email?: string | null;
        };
      };
      customers: {
        Row: {
          customer_id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
      };
      subscriptions: {
        Row: {
          subscription_id: string;
          subscription_status: string;
          price_id: string | null;
          product_id: string | null;
          scheduled_change: string | null;
          customer_id: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
