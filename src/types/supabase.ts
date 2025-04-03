// This type is used to define the shape of our database.
// It's used to provide type safety for our Supabase client.
export type Database = {
  public: {
    tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin' | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | null;
        };
      };
      // Add other tables as needed
    };
    views: {
      [_ in never]: never;
    };
    functions: {
      [_ in never]: never;
    };
    enums: {
      [_ in never]: never;
    };
  };
}; 