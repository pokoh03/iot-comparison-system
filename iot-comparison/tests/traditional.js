const {ethers} = require('hardhat')

const {performance} = require('perf_hooks')

async function testTraditionalIoT({messageCount, deviceCount}) {
    const IoT = await ethers.getContractFactory('TraditionalIoT')

    const iot = await IoT.deploy()

    await iot.deployed()

    // Register devices

    for (let i = 0; i < deviceCount; i++) {
        await iot.registerDevice(`device-${i}`)
    }

    const latencies = []

    const startTime = performance.now()

    // Send messages

    for (let i = 0; i < messageCount; i++) {
        const deviceId = `device-${i % deviceCount}`

        const start = performance.now()

        await iot.recordData(deviceId, i)

        latencies.push(performance.now() - start)
    }

    const totalTime = (performance.now() - startTime) / 1000

    const throughput = messageCount / totalTime

    return {
        latency: latencies.reduce((a, b) => a + b, 0) / latencies.length,

        throughput,
    }
}

module.exports = {testTraditionalIoT}
