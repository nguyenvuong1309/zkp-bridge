// Importing the ethers.js library for Ethereum blockchain interaction
require('dotenv').config()
const ethers = require('ethers')

// Configuration for QuickNode endpoint and user's private key
const QUICKNODE_ENDPOINT = "https://fantom-testnet.rpc.thirdweb.com/"
const PRIVATE_KEY = "677f56f8da933302d5f78506784d7e81c2f197e15d0db96527b66ca212553908"

// Setting up the provider and signer to connect to the Ethereum network via QuickNode
const provider = new ethers.JsonRpcProvider(QUICKNODE_ENDPOINT)
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const userAddress = signer.address

// Contract details: WETH contract on the Sepolia test network
const contractAddress = '0x4f7aBaC976a84923fA2E692B1363e38A35394919'
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TransferReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TransferSent",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getBalanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferFTM",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

// Instantiating the contract object for interacting with the WETH contract
const contract = new ethers.Contract(contractAddress, contractABI, provider)
const contractWithSigner = contract.connect(signer)

// Reading from the contract
// READ FUNCTION WILL BE HERE
async function getBalance() {
    const balanceBefore = await contractWithSigner.getBalance();
    console.log(`Số dư của contract: ${(balanceBefore)} FTM`);
    await contractWithSigner.transferFTM("0xf889D9774F13d8CA7F50A9E6C92a5670900aEC9f", 1)
}
getBalance().then(() => process.exit(0))
.catch((error) => {
  console.error("Lỗi không xử lý được:", error);
  process.exit(1);
});
// Writing to the contract
// WRITING FUNCTION WILL BE HERE