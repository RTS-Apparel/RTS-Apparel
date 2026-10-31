import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes("your-project.supabase.co") &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== "your-supabase-anon-key"
);

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || supabaseUrl,
  import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseAnonKey
);
