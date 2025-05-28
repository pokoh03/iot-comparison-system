const {publishData} = require('../iota/native/publisher')

const {performance} = require('perf_hooks')

async function testNativeIoTA({messageCount, deviceCount, intervalMs}) {
    const devices = Array.from({length: deviceCount}, (_, i) => `device-${i}`)

    const latencies = []

    const startTime = performance.now()

    for (let i = 0; i < messageCount; i++) {
        const device = devices[i % deviceCount]

        const start = performance.now()

        await publishData(device, i)

        latencies.push(performance.now() - start)

        if (intervalMs)
            await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    const totalTime = (performance.now() - startTime) / 1000

    const throughput = messageCount / totalTime

    return {
        latency: latencies.reduce((a, b) => a + b, 0) / latencies.length,

        throughput,
    }
}

module.exports = {testNativeIoTA}
