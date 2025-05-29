const {ethers} = require('hardhat')

// Constants
const BLOCK_TIME = 12000 // Ethereum's ~12s block time
const NETWORK_DELAY = 50 // ms
const ETH_ENERGY_PER_TX = 0.01 // kWh
const IOT_ENERGY_PER_TX = 0.000005 // kWh

describe('IoT Performance Benchmark (Realistic)', () => {
    let traditionalIoT, blockchainIoTA

    it('Traditional IoT Test', async () => {
        const txCount = 10
        const start = Date.now()
        for (let i = 0; i < txCount; i++) {
            await new Promise((res) => setTimeout(res, NETWORK_DELAY))
        }
        const end = Date.now()
        const totalTime = (end - start) / 1000
        const tps = txCount / totalTime
        const latency = NETWORK_DELAY
        const energy = txCount * IOT_ENERGY_PER_TX
        console.log(
            `[Traditional IoT] TPS: ${tps.toFixed(
                2
            )}, Latency: ${latency}ms, Energy: ${energy} kWh`
        )
    })

    it('Blockchain-IoTA Test', async function () {
        this.timeout(180000) // Set timeout to 3 minutes (or adjust as needed)
        const txCount = 10
        const start = Date.now()
        for (let i = 0; i < txCount; i++) {
            const tx = await ethers.provider.send('eth_sendTransaction', [
                {
                    from: (await ethers.getSigners())[0].address,
                    to: (await ethers.getSigners())[0].address,
                    value: '0x1',
                },
            ])
            await new Promise((res) => setTimeout(res, BLOCK_TIME))
        }
        const end = Date.now()
        const totalTime = (end - start) / 1000
        const tps = txCount / totalTime
        const latency = BLOCK_TIME
        const energy = txCount * ETH_ENERGY_PER_TX
        console.log(
            `[Blockchain-IoTA] TPS: ${tps.toFixed(
                2
            )}, Latency: ${latency}ms, Energy: ${energy} kWh`
        )
    })
})
