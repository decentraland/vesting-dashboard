/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_VESTINGS_API_URL: string
  readonly VITE_REACT_APP_PROPOSALS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
