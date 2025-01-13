require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x677f56f8da933302d5f78506784d7e81c2f197e15d0db96527b66ca212553908"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  mocha: {
    timeout: 1200000,
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  networks: {
    zkatana: {
      chainId: 1261120,
      url: "https://rpc.zkatana.gelato.digital",
      accounts: [PRIVATE_KEY],
    },
    shibuya: {
      chainId: 81,
      url: "https://evm.shibuya.astar.network",
      accounts: [PRIVATE_KEY],
    },
    fantom: {
      chainId: 4002,
      url: "https://fantom-testnet.rpc.thirdweb.com/",
      accounts: [PRIVATE_KEY],
    }
  }
};
