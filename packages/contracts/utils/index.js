const bigintConversion = require('bigint-conversion')
const { buildPoseidon } = require("circomlibjs")
const { plonk } = require("snarkjs")


exports.encode = (val) => {
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

exports.toFixedHex = (number, length = 32) => {
    let str = BigInt(number).toString(16)
    while (str.length < length * 2) str = '0' + str
    str = '0x' + str
    return str
}

exports.hasher = async (items) => {
    const poseidon = await buildPoseidon()
    let hashed = []
    for (let item of items) {
        hashed.push(await this.encode(item))
    }
    const preImage = hashed.reduce((sum, x) => sum + x, 0n);
    return poseidon.F.toObject(poseidon([preImage]))
}

exports.hashCommitment = async (daoId, secret) => {
    return this.hasher([`${daoId}`, `${secret}`])
}

exports.proveToProof = async (prove) => {
    const calldata = await plonk.exportSolidityCallData(prove.proof, prove.publicSignals)
    const proof = JSON.parse(calldata.substring(0, calldata.indexOf("]") + 1))
    return proof
}