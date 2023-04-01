import { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-verify';
import '@truffle/dashboard-hardhat-plugin';

import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_000
      }
    }
  },
  zksolc: {
    version: '1.3.7',
    compilerSource: 'binary',
    settings: {}
  }

  // uncomment it to work with local node or goerli,
  // for tests to work it should be commented out, otherwise it will be trying to connect to local node
  /*defaultNetwork: 'zkSyncTestnet',
  networks: {
    hardhat: {
      mining: {
        interval: 5000
      }
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [
        process.env.GOERLI_PRIVATE_KEY_1,
        process.env.GOERLI_PRIVATE_KEY_2,
        process.env.GOERLI_PRIVATE_KEY_3
      ],
      gas: 2100000,
      gasPrice: 8000000000
    },
    'opt-goerli': {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [
        process.env.GOERLI_PRIVATE_KEY_1,
        process.env.GOERLI_PRIVATE_KEY_2,
        process.env.GOERLI_PRIVATE_KEY_3
      ],
      gas: 2100000,
      gasPrice: 8000000000
    },
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: [
        process.env.GOERLI_PRIVATE_KEY_1,
        process.env.GOERLI_PRIVATE_KEY_2,
        process.env.GOERLI_PRIVATE_KEY_3
      ]
    },
    dashboard: {
      url: 'http://localhost:24012/rpc'
    },
    zkSyncTestnet: {
      url: 'https://zksync2-testnet.zksync.dev',
      ethNetwork: 'goerli', // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
    }
  },
  etherscan: {
    apiKey: process.env.GOERLI_ETHERSCAN_API_KEY
  }*/
};

export default config;
