/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_AI: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
