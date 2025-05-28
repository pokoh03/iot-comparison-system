const {expect} = require('chai')
const {ethers} = require('hardhat')

describe('Performance Comparison', function () {
    let traditionalIoT, blockchainIoTA
    let owner, oracle

    before(async () => {
        ;[owner, oracle] = await ethers.getSigners()

        // Deploy TraditionalIoT
        const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
        traditionalIoT = await TraditionalIoT.deploy()
        await traditionalIoT.waitForDeployment()

        // Deploy BlockchainIoTA (assuming this is your contract name)
        const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
        blockchainIoTA = await BlockchainIoTA.deploy()
        await blockchainIoTA.waitForDeployment()
    })

    it('Test Traditional IoT performance', async function () {
        const start = Date.now()

        for (let i = 0; i < 10; i++) {
            await traditionalIoT.storeData(`proof-${i}`)
        }

        const duration = Date.now() - start
        console.log(`Traditional IoT: 10 transactions in ${duration}ms`)
    })

    it('Test Blockchain-IoTA performance', async function () {
        const start = Date.now()

        for (let i = 0; i < 10; i++) {
            // FIX: Correct use of ethers.utils.formatBytes32String
            const formattedData = ethers.utils.formatBytes32String(`proof-${i}`)
            await blockchainIoTA.storeData(formattedData)
        }

        const duration = Date.now() - start
        console.log(`Blockchain-IoTA: 10 transactions in ${duration}ms`)
    })
})
