const {composeAPI} = require('@iota/core')

// Mock function - replace with real IOTA publishing
async function publishData(deviceId, value) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve({
                success: true,
                messageId: `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 10)}`,
            })
        }, 100) // 100ms delay simulation
    })
}

module.exports = {publishData}
