declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTRACT_ADDR: string;
    }
  }
}
export {};
