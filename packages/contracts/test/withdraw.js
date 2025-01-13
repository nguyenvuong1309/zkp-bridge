
const { expect } = require("chai")
const wasm_tester = require("circom_tester").wasm;
const path = require("path")

const { MerkleTree } = require("../utils/MerkleTree")
const { encode, hashCommitment } = require("../utils")

const LEVELS = 4
const ZERO_VALUE = 0
const SECRET = "SECRET"

describe('#withdraw', () => {

    let circuit

    before(async () => {
        circuit = await wasm_tester(path.join("circuits", "withdraw.circom"))

        tree = new MerkleTree(LEVELS, ZERO_VALUE)
        await tree.init()
    })

    it('should withdraw success', async () => {

        let leaves = []

        for (let i = 1; i <= 3; i++) {
            const leaf = await hashCommitment(i, SECRET)
            await tree.insert(leaf)
            leaves.push(leaf)
        }

        const root = tree.root

        for (let i = 0; i < 3; i++) {
            const proof = tree.getPathUpdate(i)
            const circuitInputs = {
                root,
                secret: encode(`${SECRET}`),
                daoId: encode(`${i + 1}`),
                path_elements: proof[0],
                path_index: proof[1],
            }

            const witness = await circuit.calculateWitness(circuitInputs)
            await circuit.checkConstraints(witness)
        }
    })
})