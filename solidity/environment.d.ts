declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTRACT_ADDR: string;
      GOERLI_ALCHEMY_API_KEY: string;
      GOERLI_PRIVATE_KEY_1: string;
      GOERLI_PRIVATE_KEY_2: string;
      GOERLI_PRIVATE_KEY_3: string;
    }
  }
}
export {};
