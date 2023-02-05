/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MAGIC_ENABLED: string; // TODO: booleans are not unwrapped properly, use string
  readonly VITE_MAGIC_API_KEY: string;
  readonly VITE_REBUILD3_CONTRACT_ADDR: string;
  readonly VITE_INIT_CONNECT: string;
  readonly VITE_MORALIS_API_KEY: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_DEFAULT_NETWORK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
