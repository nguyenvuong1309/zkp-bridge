import { useCallback } from "react"
import { useConnectWallet } from '@web3-onboard/react'
import { ethers } from "ethers";
import DAORegistryABI from "../abi/DAORegistry.json"
import DAOCheckABI from "../abi/DAOCheck.json"
import axios from 'axios';
const { plonk } = require("snarkjs")
import dotenv from "dotenv";
dotenv.config();

import { MerkleTree } from "@/utils/MerkleTree";

import { DAOCHECK_ADDRESS, DAOREGISTRY_ADDRESS } from "../constants"
import { hashCommitment, proveToProof, encode } from "@/utils";

const MERKLE_TREE_DEPTH = process.env.NEXT_PUBLIC_MERKLE_TREE_DEPTH

const ETH_PRICE = 0.08

const useDAOCheck = () => {

    const [{ wallet }] = useConnectWallet()

    const registerDao = useCallback(async ({
        name,
        address,
        jurisdiction,
        isParent = true,
        parentId = 0
    }) => {

        if (!wallet) {
            return
        }

        const provider = new ethers.BrowserProvider(wallet.provider)
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(DAOREGISTRY_ADDRESS, DAORegistryABI, signer);

        const tx = await contract.register(
            ethers.encodeBytes32String(name),
            ethers.encodeBytes32String(address),
            ethers.encodeBytes32String(jurisdiction),
            isParent,
            parentId
        )

        await tx.wait()

        const daoCount = await contract.daoCount()

        return (Number(daoCount))
    }, [wallet])

    const createWallet = useCallback(async (commitment, duty) => {

        if (!wallet) {
            return
        }

        const provider = new ethers.BrowserProvider(wallet.provider)
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(DAOCHECK_ADDRESS, DAOCheckABI, signer)

        const tx = await contract.create(commitment, duty)

        await tx.wait()

    }, [wallet])

    const withdraw = useCallback(async (commitment, passcode, onchainId, amount, dutyAmount) => {

        if (!wallet) {
            return
        }

        const address = wallet && wallet.accounts[0] && wallet.accounts[0].address

        const LEVELS = 4
        const ZERO_VALUE = 0


        const provider = new ethers.BrowserProvider(wallet.provider)
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(DAOCHECK_ADDRESS, DAOCheckABI, signer);

        let tree = new MerkleTree(LEVELS, ZERO_VALUE)
        await tree.init()

        let pathIndex = 0

        let leaves = []
        for (let i = 0; i < await contract.leafCount(); i++) {
            leaves.push(await contract.leaves(i))
            await tree.insert(leaves[i])
            if (`${leaves[i]}` === commitment) {
                pathIndex = i
            }
        }

        const currentRoot = await contract.root()
        let proof

        console.log("on-chain root : ", currentRoot)
        console.log("current root : ", tree.root)

        if (currentRoot !== tree.root) {

            if (currentRoot === 0n) {
                let zeros = []
                for (let i = 0; i < 24; i++) zeros.push(0n)
                const tx = await contract.updateRoot(zeros, tree.root)
                await tx.wait()
            } else {

                console.log("index : ", pathIndex)

                const treeOutput = tree.getPathUpdate(pathIndex)

                const prove = await plonk.fullProve(
                    {
                        root: tree.root,
                        secret: encode(passcode),
                        daoId: encode(onchainId),
                        path_elements: treeOutput[0],
                        path_index: treeOutput[1],
                    },
                    `./circuits/withdraw.wasm`,
                    `./circuits/withdraw.zkey`
                )

                proof = await proveToProof(prove)

                const tx = await contract.updateRoot(proof, tree.root)
                await tx.wait()
            }

        }

        if (!proof) {
            const treeOutput = tree.getPathUpdate(pathIndex)

            // prove that you know the knowledge
            const prove = await plonk.fullProve(
                {
                    root: tree.root,
                    secret: encode(`${passcode}`),
                    daoId: encode(`${onchainId}`),
                    path_elements: treeOutput[0],
                    path_index: treeOutput[1],
                },
                `./circuits/withdraw.wasm`,
                `./circuits/withdraw.zkey`
            )

            proof = await proveToProof(prove)

            console.log("proof : ", proof)
        }

        if (amount !== "0") {

            console.log("withdrawing : ", amount)

            const tx = await contract.withdraw(
                proof,
                commitment,
                amount,
                "0x25bE1016Cd01747E8ED5e22ddA4aD0449653f66F"
            )

            await tx.wait()

            console.log("withdrawn success : ", amount)
        }

        if (dutyAmount !== "0") {

            console.log("withdrawing duty : ", dutyAmount)

            const tx = await contract.withdraw(
                proof,
                commitment,
                dutyAmount,
                "0x25bE1016Cd01747E8ED5e22ddA4aD0449653f66F"
            )
            await tx.wait()

            console.log("withdrawn duty success : ", dutyAmount)
        }

    }, [wallet])

    const listWallet = useCallback(async (daoId, secret) => {

        if (!wallet) {
            return
        }

        const provider = new ethers.BrowserProvider(wallet.provider)
        const contract = new ethers.Contract(DAOCHECK_ADDRESS, DAOCheckABI, provider)

        let wallets = []

        for (let i = 0; i < 3; i++) {
            const commitment = await hashCommitment(`${daoId}${i}`, secret)

            const address = await contract.walletToAddress(commitment)

            if (address === "0x0000000000000000000000000000000000000000") {
                break
            }

            const dutyRate = await contract.walletToDuty(commitment)
            const balance = await contract.balances(commitment)
            const duty = await contract.duties(commitment)

            wallets.push({
                commitment: `${commitment}`,
                onchainId: `${daoId}${i}`,
                address,
                dutyRate: Number(dutyRate),
                balance: `${balance}`,
                duty: `${duty}`,
                balanceInUsd: Number(ethers.formatEther(balance)) * ETH_PRICE,
                dutyInUsd: Number(ethers.formatEther(duty)) * ETH_PRICE
            })
        }

        return wallets

    }, [wallet])

    const listHistory = useCallback(async (address) => {
        const { data } = await axios.get(`https://blockscout.com/shibuya/api?module=account&action=txlist&address=${address}`)
        console.log("🚀 ~ listHistory ~ data:", data)
        const { result } = data
        console.log("🚀 ~ listHistory ~ result:", result)
        return result
    }, [wallet])

    const listDAO = useCallback(async () => {

        const provider = wallet ? new ethers.BrowserProvider(wallet.provider) : new ethers.JsonRpcProvider("https://evm.shibuya.astar.network")
        const contract = new ethers.Contract(DAOREGISTRY_ADDRESS, DAORegistryABI, provider)

        const total = await contract.daoCount()

        let items = []

        for (let i = 1; i <= Number(total); i++) {
            const daoData = await contract.gazettes(i)
            items.push({
                daoId: i,
                name: ethers.decodeBytes32String(daoData["name"]),
                address: ethers.decodeBytes32String(daoData["addr"]),
                jurisdiction: ethers.decodeBytes32String(daoData["jurisdiction"]),
                isParent: daoData["isParent"],
                parentId: Number(daoData["parentId"]),
                owner: daoData["representative"]
            })
        }

        const parsed = items.reverse()
        return parsed
    }, [wallet])

    return {
        registerDao,
        listHistory,
        createWallet,
        listWallet,
        listDAO,
        withdraw
    }
}

export default useDAOCheck