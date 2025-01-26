/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENAI_BRAIN_CONSULTANT_ID: string
  readonly VITE_OPENAI_BRAIN_CONSULTANT_API_KEY: string
  readonly VITE_OPENAI_MARKETING_COACHING_ID: string
  readonly VITE_OPENAI_MARKETING_COACHING_API_KEY: string
  readonly VITE_RETELL_BASE_URL?: string
  readonly VITE_RETELL_WEBSOCKET_URL?: string
  readonly VITE_RETELL_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
