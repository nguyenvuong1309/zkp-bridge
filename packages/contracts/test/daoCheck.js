const { ethers } = require("hardhat")
const { expect } = require("chai")
const fs = require("fs")

const { plonk } = require("snarkjs")

const { MerkleTree } = require("../utils/MerkleTree")
const { encode, hashCommitment, proveToProof } = require("../utils")

const LEVELS = 4
const ZERO_VALUE = 0
const SECRET = "SECRET"

describe("#daoCheck", () => {

    let contract

    let admin
    let alice
    let bob

    let commitments

    let tree

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const Verifier = await ethers.getContractFactory("Verifier")
        const DAOCheck = await ethers.getContractFactory("DAOCheck")

        // deploy contract
        const verifier = await Verifier.deploy()
        contract = await DAOCheck.deploy(verifier)

        tree = new MerkleTree(LEVELS, ZERO_VALUE)
        await tree.init()
    })

    it("should create on-chain wallets success", async function () {

        commitments = []

        for (let i = 0; i <= 2; i++) {
            const commitment = await hashCommitment(i + 1, SECRET)
            commitments.push(commitment)

            // create a wallet
            await contract.create(commitment, 1000 * i) // 0%, 10%, 20%

            expect((await contract.wallets(commitment))).to.true
            expect((await contract.walletToAddress(commitment)) !== ethers.ZeroAddress).to.true
        }

    })

    it("should deposit the wallet and redirect to DaoCheck contract success", async function () {

        for (let commitment of commitments) {

            const depositAddress = await contract.walletToAddress(commitment)

            await admin.sendTransaction({
                to: depositAddress,
                value: ethers.parseEther("0.1")
            });

            const bal = await contract.balances(commitment)
            const duty = await contract.duties(commitment)

            const deduction = (0.1 * (commitments.indexOf(commitment) * 0.1)).toFixed(2)

            expect((Number(ethers.formatEther(bal)).toFixed(2))).to.equal((0.1 - deduction).toFixed(2))
            expect((Number(ethers.formatEther(duty)).toFixed(2))).to.equal(deduction)
        }

    })

    it("should update 1st merkle root success", async function () {

        // get all leaves
        let leaves = []
        for (let i = 0; i < await contract.leafCount(); i++) {
            leaves.push(await contract.leaves(i))
            await tree.insert(leaves[i])
        }

        const root = tree.root

        let zeros = []

        for (let i = 0; i < 24; i++) zeros.push(0n)

        await contract.updateRoot(zeros, root)

        expect(await contract.root()).to.equal(root)
    })

    it("should update 2nd merkle root success", async function () {

        // We need to check again because the proof checking was bypassed on the first time

        const treeOutput = tree.getPathUpdate(0)

        const input = {
            root: tree.root.toString(),
            secret: encode(`${SECRET}`),
            daoId: encode("1"),
            path_elements: treeOutput[0].map(BigInt),
            path_index: treeOutput[1].map(BigInt),
        }

        console.log(input)

        fs.writeFileSync("input.json", JSON.stringify(input, null, 2))

        const prove = await plonk.fullProve(
            input,
            `./circuits/withdraw.wasm`,
            `./circuits/withdraw.zkey`
        )

        const proof  = await proveToProof(prove)

        console.log("prove",prove)

        await contract.updateRoot(proof, tree.root)
        
        expect(await contract.root()).to.equal(tree.root)
    })

    it("should withdraw payments success", async function () {

        // use 2nd commitment that has 10% duty 
        
        const treeOutput = tree.getPathUpdate(1)

        // prove that you know the knowledge
        const prove = await plonk.fullProve(
            {
                root: tree.root,
                secret: encode(`${SECRET}`),
                daoId: encode("2"),
                path_elements: treeOutput[0],
                path_index: treeOutput[1],
            },
            `./circuits/withdraw.wasm`,
            `./circuits/withdraw.zkey`
        )

        console.log(prove)

        const proof  = await proveToProof(prove)

        // withdraw non-duty first
        
        await contract.withdraw(
            proof,
            commitments[1],
            ethers.parseEther("0.05"),
            admin.address
        )

        const remainingBal = await contract.balances(commitments[1])

        expect(remainingBal.toString()).to.equal("40000000000000000") // 0.04

        // withdraw the duty 

        await contract.withdrawDuty(
            proof,
            commitments[1],
            ethers.parseEther("0.01"),
            admin.address
        )

        const remainingDuty = await contract.duties(commitments[1])

        expect(remainingDuty.toString()).to.equal("0")


    })

})