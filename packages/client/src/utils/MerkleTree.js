import { buildPoseidon } from "circomlibjs"

export const Hasher = async (left, right) => {
    const poseidon = await buildPoseidon()
    return poseidon.F.toObject(poseidon([left, right]))
}

export class MerkleTree {

    leaves = []

    constructor(depth, zeroValue, hashLeftRight = Hasher) {
        this.depth = depth
        this.zeroValue = zeroValue
        this.hashLeftRight = hashLeftRight
        this.nextIndex = 0
        this.zeros = { 0: this.zeroValue }
        this.lastCalculatedNodeValueAtLevel = { 0: this.zeroValue }
        this.filledNodesAtLevel = { 0: {} }
        this.leafNumber = Math.pow(2, this.depth)

    }

    async init() {

        // create empty merkletree using given zero value at leaf level
        for (let i = 1; i < this.depth; i++) {
            this.zeros[i] = await this.hashLeftRight(
                this.zeros[i - 1],
                this.zeros[i - 1]
            )
            this.lastCalculatedNodeValueAtLevel[i] = this.zeros[i]
            this.filledNodesAtLevel[i] = {}
        }

        // compute the merkle root
        this.root = await this.hashLeftRight(
            this.zeros[this.depth - 1],
            this.zeros[this.depth - 1]
        )

    }

    async insert(value) {
        if (this.nextIndex + 1 > this.leafNumber) {
            throw new Error('Merkle Tree at max capacity')
        }

        let curIdx = this.nextIndex
        this.nextIndex += 1

        let currentLevelHash = value
        let left
        let right

        for (let i = 0; i < this.depth; i++) {
            if (curIdx % 2 === 0) {
                left = currentLevelHash
                right = this.zeros[i]

                this.lastCalculatedNodeValueAtLevel[i] = currentLevelHash
                this.filledNodesAtLevel[i][curIdx] = left
                this.filledNodesAtLevel[i][curIdx + 1] = right
            } else {
                left = this.lastCalculatedNodeValueAtLevel[i]
                right = currentLevelHash

                this.filledNodesAtLevel[i][curIdx - 1] = left
                this.filledNodesAtLevel[i][curIdx] = right
            }

            currentLevelHash = await this.hashLeftRight(left, right)
            curIdx = Math.floor(curIdx / 2)
        }

        this.root = currentLevelHash

        this.leaves.push(value)
    }

    async update(leafIndex, value) {
        if (leafIndex >= this.nextIndex) {
            throw new Error('The leaf index specified is too large')
        }

        let temp = this.leaves
        temp[leafIndex] = value

        const newTree = new MerkleTree(this.depth, this.zeroValue)
        await newTree.init()

        for (let i = 0; i < temp.length; i++) {
            newTree.insert(temp[i])
        }

        this.leaves = newTree.leaves
        this.zeros = newTree.zeros
        this.filledNodesAtLevel = newTree.filledNodesAtLevel
        this.lastCalculatedNodeValueAtLevel = newTree.lastCalculatedNodeValueAtLevel
        this.root = newTree.root
        this.nextIndex = newTree.nextIndex
    }

    getLeaf(index) {
        const leafIndex = parseInt(index.toString(), 10)

        return this.leaves[leafIndex]
    }

    getPathUpdate(
        index
    ) {
        const leafIndex = parseInt(index.toString(), 10)
        if (leafIndex >= this.nextIndex) {
            throw new Error('Path not constructed yet, leafIndex >= nextIndex')
        }

        let curIdx = leafIndex
        let path  = []
        let pathIndex  = []

        for (let i = 0; i < this.depth; i++) {
            if (curIdx % 2 === 0) {
                path.push(this.filledNodesAtLevel[i][curIdx + 1])
                pathIndex.push(0)
            } else {
                path.push(this.filledNodesAtLevel[i][curIdx - 1])
                pathIndex.push(1)
            }
            curIdx = Math.floor(curIdx / 2)
        }

        return [path, pathIndex]
    }

}

 