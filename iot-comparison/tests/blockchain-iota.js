const {ethers} = require('hardhat')

const {publishData} = require('../iota/native/publisher')

async function testBlockchainIoTA({messageCount, deviceCount}) {
    const [owner, oracle] = await ethers.getSigners()

    const IoTA = await ethers.getContractFactory('BlockchainIoTA')

    const iota = await IoTA.deploy(oracle.address, 3)

    await iota.deployed()

    // Register devices (using mock public keys)

    for (let i = 0; i < deviceCount; i++) {
        await iota
            .connect(owner)
            .registerDevice(
                `device-${i}`,
                ethers.utils.formatBytes32String(`pubkey-${i}`)
            )
    }

    const latencies = []

    const startTime = performance.now()

    // Send messages

    for (let i = 0; i < messageCount; i++) {
        const deviceId = `device-${i % deviceCount}`

        const start = performance.now()

        // Publish to IOTA

        const {messageId, bundleHash} = await publishData(deviceId, i)

        // Verify on blockchain (as oracle)

        await iota.connect(oracle).verifyIotaData(
            deviceId,

            i,

            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(messageId)),

            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(bundleHash)),

            3,

            '0x'
        )

        latencies.push(performance.now() - start)
    }

    const totalTime = (performance.now() - startTime) / 1000

    const throughput = messageCount / totalTime

    return {
        latency: latencies.reduce((a, b) => a + b, 0) / latencies.length,

        throughput,
    }
}

module.exports = {testBlockchainIoTA}
