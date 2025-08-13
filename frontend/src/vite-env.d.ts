/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_USE_SPOTIFY_MOCK?: string; // '1' | '0'
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
