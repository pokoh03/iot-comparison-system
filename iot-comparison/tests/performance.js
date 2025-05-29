const { ethers } = require('hardhat')
const { publishData } = require('../iota/publisher')

describe('Performance Comparison', function () {
    this.timeout(60000) // Increase timeout for all tests

    let traditionalIoT, blockchainIoTA
    let owner, oracle
    const testIterations = 10

    before(async () => {
        ;[owner, oracle] = await ethers.getSigners()

        // Deploy contracts
        const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
        traditionalIoT = await TraditionalIoT.deploy()

        const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
        blockchainIoTA = await BlockchainIoTA.deploy(oracle.address)
    })

    const calculateMetrics = (startTime, endTime, iterations) => {
        const durationMs = endTime - startTime
        return {
            latency: durationMs / iterations,
            tps: (iterations / (durationMs / 1000)).toFixed(2),
            energy: (durationMs * 0.1).toFixed(2), // Placeholder for actual energy measurement
        }
    }

    it('Test Traditional IoT performance', async function () {
        await traditionalIoT.registerDevice('device1')

        const start = Date.now()
        for (let i = 0; i < testIterations; i++) {
            await traditionalIoT.recordData('device1', i)
        }
        const duration = Date.now() - start
        const metrics = calculateMetrics(start, Date.now(), testIterations)

        console.log(`
                                                                                                                                Traditional IoT Performance:
                                                                                                                                    - Total Time: ${duration}ms
                                                                                                                                        - Transactions: ${testIterations}
                                                                                                                                            - Latency: ${metrics.latency}ms/tx
                                                                                                                                                - TPS: ${metrics.tps}
                                                                                                                                                    - Energy: ${metrics.energy} Joules (simulated)`)
    })

    it('Test Blockchain-IoTA performance', async function () {
        await blockchainIoTA.registerDevice('device2')

        const start = Date.now()
        for (let i = 0; i < testIterations; i++) {
            const proof = ethers.encodeBytes32String(`proof-${i}`)
            await blockchainIoTA
                .connect(oracle)
                .verifyIotaData('device2', i, proof)
        }
        const duration = Date.now() - start
        const metrics = calculateMetrics(start, Date.now(), testIterations)

        console.log(`
                                                                                                                                                                                                                                          Blockchain-IoTA Performance:
                                                                                                                                                                                                                                              - Total Time: ${duration}ms
                                                                                                                                                                                                                                                  - Transactions: ${testIterations}
                                                                                                                                                                                                                                                      - Latency: ${metrics.latency}ms/tx
                                                                                                                                                                                                                                                          - TPS: ${metrics.tps}
                                                                                                                                                                                                                                                              - Energy: ${metrics.energy} Joules (simulated)`)
    })

    it('Test Native IOTA performance', async function () {
        const start = Date.now()
        const promises = []

        for (let i = 0; i < testIterations; i++) {
            promises.push(publishData(`native-device-${i % 3}`, i))
        }

        await Promise.all(promises)
        const duration = Date.now() - start
        const metrics = calculateMetrics(start, Date.now(), testIterations)

        console.log(`
                                                                                                                                                                                                                                                                                                                        Native IOTA Performance:
                                                                                                                                                                                                                                                                                                                            - Total Time: ${duration}ms
                                                                                                                                                                                                                                                                                                                                - Transactions: ${testIterations}
                                                                                                                                                                                                                                                                                                                                    - Latency: ${metrics.latency}ms/tx
                                                                                                                                                                                                                                                                                                                                        - TPS: ${metrics.tps} 
                                                                                                                                                                                                                                                                                                                                            - Energy: ${metrics.energy} Joules (simulated)`)
    })
})
