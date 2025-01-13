import * as bigintConversion from "bigint-conversion"
import { buildPoseidon } from "circomlibjs"
import { plonk } from "snarkjs"

export const encode = (val) => {
    switch (typeof val) {
        case "number":
            return BigInt(val);
        case "string":
            return bigintConversion.textToBigint(val);
        case "object":
            return bigintConversion.bufToBigint(val.buffer);
        default:
            return 0n;
    }
}

export const shortAddress = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}

export const hasher = async (items) => {
    const poseidon = await buildPoseidon()
    let hashed = []
    for (let item of items) {
        hashed.push(await encode(item))
    }
    const preImage = hashed.reduce((sum, x) => sum + x, 0n);
    return poseidon.F.toObject(poseidon([preImage]))
}

export const hashCommitment = async (daoId, secret) => {
    return hasher([`${daoId}`, `${secret}`])
}

export const proveToProof = async (prove) => {
    const calldata = await plonk.exportSolidityCallData(prove.proof, prove.publicSignals)
    const proof = JSON.parse(calldata.substring(0, calldata.indexOf("]") + 1))
    return proof
}