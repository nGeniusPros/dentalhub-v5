import { createClient } from '@dentalhub/database';
export class SupabaseService {
    constructor() {
        this.supabase = createClient();
    }
    async getSession() {
        return await this.supabase.auth.getSession();
    }
    async getUser() {
        return await this.supabase.auth.getUser();
    }
    async signInWithPassword(email, password) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }
    async signUp(email, password) {
        return await this.supabase.auth.signUp({ email, password });
    }
    async signOut() {
        return await this.supabase.auth.signOut();
    }
    async resetPasswordForEmail(email) {
        return await this.supabase.auth.resetPasswordForEmail(email);
    }
    async updateUser(password) {
        return await this.supabase.auth.updateUser({ password });
    }
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
    from(table) {
        return {
            select: async (select) => {
                return await this.supabase.from(table).select(select);
            },
            insert: async (data) => {
                return await this.supabase.from(table).insert(data);
            },
            update: async (data) => {
                return await this.supabase.from(table).update(data);
            },
            delete: async () => {
                return await this.supabase.from(table).delete();
            }
        };
    }
    async rpc(fn, args) {
        return await this.supabase.rpc(fn, args);
    }
}
