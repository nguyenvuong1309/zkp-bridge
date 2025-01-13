const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("#daoRegistry", () => {

    let contract

    let alice
    let bob

    before(async () => {

        [alice, bob] = await ethers.getSigners();

        const DAORegistry = await ethers.getContractFactory("DAORegistry")

        // deploy contract
        contract = await DAORegistry.deploy()

    })


    it("should register new dao success", async function () {

        await contract.register(
            ethers.encodeBytes32String("MY DAO"),
            ethers.encodeBytes32String("MY ADDRESS"),
            ethers.encodeBytes32String("SOMEWHERE"),
            true,
            0
        )

        const dao = await contract.gazettes(1)

        expect(dao[0]).to.equal(ethers.encodeBytes32String("MY DAO"))
        expect(dao[1]).to.equal(ethers.encodeBytes32String("MY ADDRESS"))
        expect(dao[2]).to.equal(ethers.encodeBytes32String("SOMEWHERE"))

        expect(dao[6]).to.equal(alice.address)
    })

    it("should return error when someone else want to update the info", async function () {
        
        try {
            await contract.connect(bob).updateDaoName(1, ethers.encodeBytes32String("MY NEW DAO"))
        } catch (e) {
            expect(e.message).includes("Invalid caller")
        }

    })

})