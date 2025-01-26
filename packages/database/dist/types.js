import { createClient } from "@supabase/supabase-js";
export const createDatabaseClient = (url, key) => {
    return createClient(url, key);
};
//# sourceMappingURL=types.js.map