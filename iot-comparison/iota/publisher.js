const {composeAPI} = require('@iota/core')
const iota = composeAPI({provider: 'https://chrysalis-nodes.iota.org'})

async function publishData(deviceId, value) {
    try {
        const start = Date.now()

        // Prepare message
        const message = {
            deviceId,
            value,
            timestamp: new Date().toISOString(),
        }

        // Convert to trytes and attach to tangle
        const response = await iota.sendTransfer(
            process.env.IOTA_SEED,
            {
                address: process.env.IOTA_ADDRESS,
                value: 0,
                message: JSON.stringify(message),
            },
            {depth: 3, mwm: 9}
        )

        return {
            success: true,
            messageId: response[0].hash,
            latency: Date.now() - start,
        }
    } catch (error) {
        console.error('IOTA Publish Error:', error)
        return {success: false, error}
    }
}

module.exports = {publishData}
