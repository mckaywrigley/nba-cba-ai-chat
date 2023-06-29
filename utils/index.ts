import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
