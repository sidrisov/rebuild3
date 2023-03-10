/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MAGIC_SUPPORTED: string; // TODO: booleans are not unwrapped properly, use string
  readonly VITE_MAGIC_ENABLED: string;
  readonly VITE_MAGIC_API_KEY: string;
  readonly VITE_INIT_CONNECT: string;
  readonly VITE_MORALIS_API_KEY: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_DEFAULT_NETWORK: string;
  readonly VITE_TALLY_DAO_URL: string;
  readonly VITE_CONTRACTS_PER_NETWORK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const APP_VERSION: string;
