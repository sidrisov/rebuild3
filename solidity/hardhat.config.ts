import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  paths: {
    //artifacts: '../artifacts'
  },
  typechain: {
    //outDir: '../typechain-types'
  },
  defaultNetwork: 'localhost',
  networks: {}
};

export default config;
