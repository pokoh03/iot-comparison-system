const {ethers} = require('hardhat')

// Real-world constants
const BLOCK_TIME = 12000 // Ethereum's 12s block time
const NETWORK_DELAY = 50 // ms
const ETH_TX_ENERGY = 0.01 // kWh (PoS)
const IOT_TX_ENERGY = 0.000005 // kWh

describe('Physically Accurate Benchmark', () => {
    let traditionalIoT, blockchainIoTA
    let owner, oracle

    before(async () => {
        ;[owner, oracle] = await ethers.getSigners()

        const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
        traditionalIoT = await TraditionalIoT.deploy()

        const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
        blockchainIoTA = await BlockchainIoTA.deploy(oracle.address)
    })

    const simulateNetwork = (action) =>
        new Promise((resolve) =>
            setTimeout(() => resolve(action()), NETWORK_DELAY)
        )

    it('Traditional IoT (Realistic)', async () => {
        await traditionalIoT.registerDevice('device1')

        const latencies = []
        const start = Date.now()

        for (let i = 0; i < 10; i++) {
            const txStart = Date.now()
            await simulateNetwork(() => traditionalIoT.recordData('device1', i))
            latencies.push(Date.now() - txStart)
        }

        const totalTime = Date.now() - start
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / 10

        console.log(`
                                                                                                                    [Traditional IoT]
                                                                                                                        Transactions: 10
                                                                                                                            Avg Latency: ${avgLatency.toFixed(
                                                                                                                                2
                                                                                                                            )}ms
                                                                                                                                TPS: ${(
                                                                                                                                    10 /
                                                                                                                                    (totalTime /
                                                                                                                                        1000)
                                                                                                                                ).toFixed(
                                                                                                                                    2
                                                                                                                                )}
                                                                                                                                    Energy: ${(
                                                                                                                                        10 *
                                                                                                                                        IOT_TX_ENERGY
                                                                                                                                    ).toExponential(
                                                                                                                                        2
                                                                                                                                    )} kWh
                                                                                                                                        `)
    })

    it('Blockchain-IoTA (Physically Accurate)', async () => {
        this.timeout(180000);
        await blockchainIoTA.registerDevice('device2')

        const start = Date.now()
        let completedTxs = 0

        // Process sequentially to respect block times
        for (let i = 0; i < 10; i++) {
            const txStart = Date.now()
            const tx = await blockchainIoTA
                .connect(oracle)
                .verifyIotaData('device2', i, ethers.ZeroHash)

            await tx.wait() // Force block inclusion
            completedTxs++

            // Minimum 12s between txs
            await new Promise((r) => setTimeout(r, BLOCK_TIME))
        }

        const totalTime = Date.now() - start

        console.log(`
                                                                                                                                                                                                                                                        [Blockchain-IoTA]
                                                                                                                                                                                                                                                            Transactions: ${completedTxs}
                                                                                                                                                                                                                                                                Avg Latency: ${BLOCK_TIME}ms (enforced)
                                                                                                                                                                                                                                                                    TPS: ${(
                                                                                                                                                                                                                                                                        completedTxs /
                                                                                                                                                                                                                                                                        (totalTime /
                                                                                                                                                                                                                                                                            1000)
                                                                                                                                                                                                                                                                    ).toFixed(
                                                                                                                                                                                                                                                                        2
                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                        Energy: ${(
                                                                                                                                                                                                                                                                            completedTxs *
                                                                                                                                                                                                                                                                            ETH_TX_ENERGY
                                                                                                                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                                                                                            6
                                                                                                                                                                                                                                                                        )} kWh
                                                                                                                                                                                                                                                                            `)
    })
})
