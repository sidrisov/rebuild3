import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.17'
  // uncomment it to work with local node or goerli, 
  // for tests to work it should be commented out, otherwise it will be trying to connect to local node
  /* 
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      mining: {
        interval: 5000
      }
    },
    goerli: {
      url: process.env.GOERLI_ALCHEMY_API_KEY,
      accounts: [
        process.env.GOERLI_PRIVATE_KEY_1,
        process.env.GOERLI_PRIVATE_KEY_2,
        process.env.GOERLI_PRIVATE_KEY_3
      ],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  etherscan: {
    apiKey: process.env.GOERLI_ETHERSCAN_API_KEY
  } 
  */
};

export default config;
