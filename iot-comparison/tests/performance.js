const {ethers} = require('hardhat')

// Real-world constraints
const BLOCK_TIME = 12000 // Ethereum's ~12s block time (Sepolia)
const NETWORK_DELAY = 50 // ms (simulated WAN latency)
const ETH_ENERGY_PER_TX = 0.01 // kWh (PoS estimate)
const IOT_ENERGY_PER_TX = 0.000005 // kWh (LoRaWAN)

describe('IoT Performance Benchmark (Realistic)', () => {
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

    // Simulate network delay
    const simulateNetwork = async (action) => {
        await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY))
        return action()
    }

    // Realistic blockchain tx with forced block time
    const realisticBlockchainTx = async (contract, ...args) => {
        const start = Date.now()
        const tx = await contract(...args)
        await tx.wait() // Force block inclusion
        const duration = Date.now() - start
        return Math.max(duration, BLOCK_TIME)
    }

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
