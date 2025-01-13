const { expect } = require("chai")

const wasm_tester = require("circom_tester").wasm;
const path = require("path")
const { buildPoseidon } = require("circomlibjs")

const { MerkleTree } = require("../utils/MerkleTree")
const { toFixedHex } = require("../utils")

const LEVELS = 4
const ZERO_VALUE = 0

describe('#merkleTree', () => {

    describe('HashLeftRight', () => {
        it('should hash correctly', async () => {
            const circuitInputs = {
                left: 12345,
                right: 45678,
            }
            const circuit = await wasm_tester(path.join("circuits/test", "merkleTreeHashLeftRight_test.circom"))
            const witness = await circuit.calculateWitness(circuitInputs)

            await circuit.assertOut(witness, { hash: 873860245626632025518983208960684733664711265941776678400896602705738743556n });
        })
    })

    describe('MerkleTree', () => {

        let circuit

        before(async () => {
            circuit = await wasm_tester(path.join("circuits/test", "merkleTree_test.circom"))

            tree = new MerkleTree(LEVELS, ZERO_VALUE)
            await tree.init()
        })

        it('should generate Merkle Root success', async () => {
            let leaves = []

            const poseidon = await buildPoseidon()

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const randVal = Math.floor(Math.random() * 1000)
                const leaf = poseidon.F.toObject(poseidon([randVal]))
                await tree.insert(leaf)
                leaves.push(leaf)
            }

            const root = tree.root

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const proof = tree.getPathUpdate(i)
                const circuitInputs = {
                    leaf: leaves[i],
                    path_elements: proof[0],
                    path_index: proof[1],
                }

                const witness = await circuit.calculateWitness(circuitInputs)

                await circuit.assertOut(witness, { root });
            }

        })

        afterEach(async () => {
            tree = new MerkleTree(LEVELS, ZERO_VALUE);
            await tree.init()
        })

    })

    describe('LeafExists', () => {
        it('should work with valid input for LeafExists', async () => {

            const circuit = await wasm_tester(path.join("circuits/test", "merkleTreeLeafExists_test.circom"))
            const poseidon = await buildPoseidon()

            const tree = new MerkleTree(LEVELS, ZERO_VALUE)
            await tree.init()

            let leaves = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const randVal = Math.floor(Math.random() * 1000)
                const leaf = poseidon.F.toObject(poseidon([randVal]))
                await tree.insert(leaf)
                leaves.push(leaf)
            }

            const root = tree.root

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const proof = tree.getPathUpdate(i)
                const circuitInputs = {
                    leaf: leaves[i],
                    path_elements: proof[0],
                    path_index: proof[1],
                    root,
                }

                const witness = await circuit.calculateWitness(circuitInputs)
                await circuit.checkConstraints(witness);
            }

        })

        it('should return error with invalid LeafExists input', async () => {

            const circuit = await wasm_tester(path.join("circuits/test", "merkleTreeLeafExists_test.circom"))
            const poseidon = await buildPoseidon()

            const tree = new MerkleTree(LEVELS, ZERO_VALUE)
            await tree.init()

            let leaves = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const randVal = Math.floor(Math.random() * 1000)
                const leaf = poseidon.F.toObject(poseidon([randVal]))
                await tree.insert(leaf)
                leaves.push(leaf)
            }

            const root = tree.root

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const proof = tree.getPathUpdate(i)

                const circuitInputs = {
                    leaf: leaves[i],
                    // swapping input elements
                    path_elements: proof[1],
                    path_index: proof[0],
                    root,
                }

                try {
                    await circuit.calculateWitness(circuitInputs)
                    assert.fail("calculatedWitness did not throw exception")
                } catch { }
            }
        })
    })


    describe('CheckRoot', () => {

        let circuit
        let poseidon

        before(async () => {
            circuit = await wasm_tester(path.join("circuits/test", "merkleTreeCheckRoot_test.circom"))

            tree = new MerkleTree(LEVELS, ZERO_VALUE)
            await tree.init()

            poseidon = await buildPoseidon()
        })

        it('should return valid root', async () => {

            let leaves = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const randVal = Math.floor(Math.random() * 1000)
                const leaf = poseidon.F.toObject(poseidon([randVal]))
                await tree.insert(leaf)
                leaves.push(leaf)
            }

            const root = tree.root

            const circuitInputs = { leaves }
            const witness = await circuit.calculateWitness(circuitInputs)

            await circuit.assertOut(witness, { root });
        })

        it('should generate different root from different leaves', async () => {

            let leaves = []

            for (let i = 0; i < 2 ** LEVELS; i++) {
                const randVal = Math.floor(Math.random() * 1000)
                const leaf = poseidon.F.toObject(poseidon([randVal]))
                await tree.insert(leaf)

                // Give the circuit a different leaf
                leaves.push(toFixedHex(randVal + 1, 32))
            }

            const root = tree.root
            const circuitInputs = { leaves }
            const witness = await circuit.calculateWitness(circuitInputs)

            expect(
                witness[1].toString()
            ).not.to.equal(root.toString())
        })

        afterEach(async () => {
            tree = new MerkleTree(LEVELS, ZERO_VALUE);
            await tree.init()
        })
    })

})