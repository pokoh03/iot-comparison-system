const {expect} = require('chai')
const {ethers} = require('hardhat')

describe('Performance Comparison', function () {
    let traditionalIoT, blockchainIoTA
    let owner, oracle

    before(async () => {
        ;[owner, oracle] = await ethers.getSigners()

        // Deploy contracts
        const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
        traditionalIoT = await TraditionalIoT.deploy()

        const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
        blockchainIoTA = await BlockchainIoTA.deploy(oracle.address)
    })

    it('Test Traditional IoT performance', async function () {
        await traditionalIoT.registerDevice('device1')

        const start = Date.now()
        for (let i = 0; i < 10; i++) {
            await traditionalIoT.recordData('device1', i)
        }
        const duration = Date.now() - start

        console.log(`Traditional IoT: 10 transactions in ${duration}ms`)
    })

    it('Test Blockchain-IoTA performance', async function () {
        await blockchainIoTA.registerDevice('device2')

        const start = Date.now()
        for (let i = 0; i < 10; i++) {
            await blockchainIoTA
                .connect(oracle)
                .verifyIotaData(
                    'device2',
                    i,
                    ethers.utils.encodeBytes32String(`proof-${i}`)
                )
        }
        const duration = Date.now() - start

        console.log(`Blockchain-IoTA: 10 transactions in ${duration}ms`)
    })
})
