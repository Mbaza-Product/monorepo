// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ACCESS_TOKEN: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_THEME_KEY: string;
  readonly VITE_USER_DATA: string;
  readonly VITE_REDIRECT_KEY: string;
  readonly VITE_RESIZE_NAVBAR: string;
  readonly VITE_MEMBERSHIP_KEY: string;
  readonly VITE_SERVICE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
