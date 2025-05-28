const {composeAPI} = require('@iota/core')

const {asciiToTrytes} = require('@iota/converter')

const {MamFactory} = require('@iota/mam.js')

const crypto = require('crypto')

const iota = composeAPI({provider: 'https://nodes.iota.org:443'})

const seed = crypto.randomBytes(81).toString('hex')

const mam = MamFactory.create(iota, seed)

async function publishData(deviceId, value) {
    const message = {
        deviceId,

        value,

        timestamp: Date.now(),
    }

    const trytes = asciiToTrytes(JSON.stringify(message))

    const {state, payload, root} = await mam.attach(trytes, 3, 9)

    return {
        root,

        messageId: payload[0].hash,

        bundleHash: payload[0].bundle,
    }
}

module.exports = {publishData, seed}
