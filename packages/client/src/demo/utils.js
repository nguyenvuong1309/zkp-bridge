// import * as bigintConversion from "bigint-conversion"
// const bigintConversion = require("bigint-conversion")
const {textToBigint, bufToBigint} = require("bigint-conversion")
const { buildPoseidon } = require("circomlibjs")
const { plonk } = require("snarkjs")

 const encode = (val) => {
    switch (typeof val) {
        case "number":
            return BigInt(val);
        case "string":
            return textToBigint(val);
        case "object":
            return bufToBigint(val.buffer);
        default:
            return 0n;
    }
}

 const shortAddress = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}

 const hasher = async (items) => {
    const poseidon = await buildPoseidon()
    let hashed = []
    for (let item of items) {
        hashed.push(await encode(item))
    }
    const preImage = hashed.reduce((sum, x) => sum + x, 0n);
    return poseidon.F.toObject(poseidon([preImage]))
}

 const hashCommitment = async (daoId, secret) => {
    return hasher([`${daoId}`, `${secret}`])
}

 const proveToProof = async (prove) => {
    const calldata = await plonk.exportSolidityCallData(prove.proof, prove.publicSignals)
    const proof = JSON.parse(calldata.substring(0, calldata.indexOf("]") + 1))
    return proof
}

module.exports = {
    encode,
    shortAddress,
    hasher,
    hashCommitment,
    proveToProof
}