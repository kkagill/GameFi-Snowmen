import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-deploy';
import '@typechain/hardhat';
import 'dotenv/config';

export default {
  networks: {
    hardhat: {
      chainId: 31337,
    },  
    mumbai: {
      url: `${process.env.ALCHEMY_MUMBAI}`,
      chainId: 80001,
      accounts: [process.env.ADMIN_PRIVATE_KEY]
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 15,
    enabled: true,
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'    

  },
  etherscan: {
    apiKey: process.env.POLYSCAN_API_KEY,
  },
  mocha: {
    timeout: 2000000,
  },
};
