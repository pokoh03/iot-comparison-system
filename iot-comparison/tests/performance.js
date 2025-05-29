const {ethers} = require('hardhat')

describe('IoT Performance Benchmark', function () {
    this.timeout(60000)
    const TRANSACTION_COUNT = 10

    // Energy constants (approximate)
    const ETH_TX_ENERGY = 0.1 // kWh per Ethereum tx (testnet estimate)
    const IOT_TX_ENERGY = 0.0001 // kWh per traditional IoT tx

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

    const calculateMetrics = (startTime, endTime, energyPerTx) => {
        const totalTime = endTime - startTime
        return {
            latency: (totalTime / TRANSACTION_COUNT).toFixed(2) + 'ms',
            tps: (TRANSACTION_COUNT / (totalTime / 1000)).toFixed(2),
            energy: (TRANSACTION_COUNT * energyPerTx).toFixed(6) + ' kWh',
        }
    }

    it('Traditional IoT Performance', async () => {
        await traditionalIoT.registerDevice('device1')

        const start = Date.now()
        for (let i = 0; i < TRANSACTION_COUNT; i++) {
            await traditionalIoT.recordData('device1', i)
        }
        const metrics = calculateMetrics(start, Date.now(), IOT_TX_ENERGY)

        console.log(`
                                                                                                                                [Traditional IoT]
                                                                                                                                    Transactions: ${TRANSACTION_COUNT}
                                                                                                                                        Latency/tx: ${metrics.latency}
                                                                                                                                            TPS: ${metrics.tps}
                                                                                                                                                Energy Used: ${metrics.energy}
                                                                                                                                                    `)
    })

    it('Blockchain-IoTA Performance', async () => {
        await blockchainIoTA.registerDevice('device2')

        const start = Date.now()
        for (let i = 0; i < TRANSACTION_COUNT; i++) {
            const proof = ethers.encodeBytes32String(`proof-${i}`)
            await blockchainIoTA
                .connect(oracle)
                .verifyIotaData('device2', i, proof)
        }
        const metrics = calculateMetrics(start, Date.now(), ETH_TX_ENERGY)

        console.log(`
                                                                                                                                                                                                        [Blockchain-IoTA]
                                                                                                                                                                                                            Transactions: ${TRANSACTION_COUNT}
                                                                                                                                                                                                                Latency/tx: ${metrics.latency}
                                                                                                                                                                                                                    TPS: ${metrics.tps}
                                                                                                                                                                                                                        Energy Used: ${metrics.energy}
                                                                                                                                                                                                                            `)
    })
})
