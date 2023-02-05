import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'localhost',
  networks: {
    // comment it, as it requires those variables during build on vercel
    /* goerli: {
      url: process.env.GOERLI_ALCHEMY_API_KEY,
      accounts: [
        process.env.GOERLI_PRIVATE_KEY_1,
        process.env.GOERLI_PRIVATE_KEY_2,
        process.env.GOERLI_PRIVATE_KEY_3
      ],
      gas: 2100000,
      gasPrice: 8000000000
    } */
  }
};

export default config;
