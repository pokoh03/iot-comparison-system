const {ethers} = require('hardhat')

// Real-world constants
const BLOCK_TIME = 12000 // 12 seconds
const NETWORK_DELAY = 50 // ms
const ETH_TX_ENERGY = 0.01 // kWh
const IOT_TX_ENERGY = 0.000005 // kWh

describe('Physically Accurate Benchmark', function () {
    this.timeout(200000) // Set per-suite timeout

    let traditionalIoT, blockchainIoTA
    let owner, oracle

    before(async function () {
        ;[owner, oracle] = await ethers.getSigners()

        const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
        traditionalIoT = await TraditionalIoT.deploy()

        const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
        blockchainIoTA = await BlockchainIoTA.deploy(oracle.address)
    })

    it('Blockchain-IoTA (Physically Accurate)', async function () {
        this.timeout(200000) // Set individual test timeout

        await blockchainIoTA.registerDevice('device2')

        const start = Date.now()
        let completedTxs = 0

        // Process 3 transactions instead of 10 for demonstration
        for (let i = 0; i < 3; i++) {
            const tx = await blockchainIoTA
                .connect(oracle)
                .verifyIotaData('device2', i, ethers.ZeroHash)

            const receipt = await tx.wait()
            completedTxs++

            console.log(`Block ${receipt.blockNumber} confirmed`)

            if (i < 2) {
                // Don't wait after last tx
                await new Promise((r) => setTimeout(r, BLOCK_TIME))
            }
        }

        const totalTime = Date.now() - start

        console.log(`
                                                                                                                                                                          [Blockchain-IoTA - Realistic]
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
    it('Traditional IoT (Real Network Conditions)', async () => {
        await traditionalIoT.registerDevice('device1')

        const latencies = []
        const start = Date.now()

        for (let i = 0; i < 10; i++) {
            const txStart = Date.now()
            await simulateNetwork(() => traditionalIoT.recordData('device1', i))
            latencies.push(Date.now() - txStart)
        }

        const totalTime = Date.now() - start
        const avgLatency =
            latencies.reduce((a, b) => a + b, 0) / latencies.length

        console.log(`
                                                                                                                                                        [Traditional IoT - Realistic]
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
                                                                                                                                                                            IOT_ENERGY_PER_TX
                                                                                                                                                                        ).toExponential(
                                                                                                                                                                            2
                                                                                                                                                                        )} kWh
                                                                                                                                                                            `)
    })

    it('Blockchain-IoTA (Realistic)', async () => {
        await blockchainIoTA.registerDevice('device2')

        const latencies = []
        const start = Date.now()

        for (let i = 0; i < 10; i++) {
            const txStart = Date.now()
            const duration = await realisticBlockchainTx(() =>
                blockchainIoTA.connect(oracle).verifyIotaData(
                    'device2',
                    i,
                    ethers.ZeroHash // Simulated proof
                )
            )
            latencies.push(duration)
        }

        const totalTime = Date.now() - start
        const avgLatency =
            latencies.reduce((a, b) => a + b, 0) / latencies.length

        console.log(`
                                                                                                                                                                                                                                                                                                          [Blockchain-IoTA - Realistic]
                                                                                                                                                                                                                                                                                                              Transactions: 10
                                                                                                                                                                                                                                                                                                                  Avg Latency: ${(
                                                                                                                                                                                                                                                                                                                      avgLatency /
                                                                                                                                                                                                                                                                                                                      1000
                                                                                                                                                                                                                                                                                                                  ).toFixed(
                                                                                                                                                                                                                                                                                                                      2
                                                                                                                                                                                                                                                                                                                  )}s
                                                                                                                                                                                                                                                                                                                      TPS: ${(
                                                                                                                                                                                                                                                                                                                          10 /
                                                                                                                                                                                                                                                                                                                          (totalTime /
                                                                                                                                                                                                                                                                                                                              1000)
                                                                                                                                                                                                                                                                                                                      ).toFixed(
                                                                                                                                                                                                                                                                                                                          2
                                                                                                                                                                                                                                                                                                                      )}
                                                                                                                                                                                                                                                                                                                          Energy: ${(
                                                                                                                                                                                                                                                                                                                              10 *
                                                                                                                                                                                                                                                                                                                              ETH_ENERGY_PER_TX
                                                                                                                                                                                                                                                                                                                          ).toFixed(
                                                                                                                                                                                                                                                                                                                              6
                                                                                                                                                                                                                                                                                                                          )} kWh
                                                                                                                                                                                                                                                                                                                              `)
    })
})
