import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";
import type { AuthenticatedUser } from "../middleware/auth.js";

declare global {
  namespace Express {
    interface Request {
      supabase: SupabaseClient<Database>;
      user?: AuthenticatedUser;
      validated?: any;
    }
  }
}
