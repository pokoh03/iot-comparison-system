// iota/publisher.js - Mock implementation
const {ethers} = require('ethers')

async function publishData(deviceId, value) {
    return {
        messageId: ethers.encodeBytes32String(`msg-${Date.now()}`),
        bundleHash: ethers.encodeBytes32String(`bundle-${Date.now()}`),
        value: value,
        timestamp: Math.floor(Date.now() / 1000),
    }
}

module.exports = {publishData}
