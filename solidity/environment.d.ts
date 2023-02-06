declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTRACT_ADDR: string;
      GOV_CONTRACT_ADDR: string;
      TOKEN_CONTRACT_ADDR: string;
      GOERLI_ALCHEMY_API_KEY: string;
      GOERLI_ETHERSCAN_API_KEY: string;
      GOERLI_PRIVATE_KEY_1: string;
      GOERLI_PRIVATE_KEY_2: string;
      GOERLI_PRIVATE_KEY_3: string;
      PROPOSAL_ID: string;
    }
  }
}
export {};
