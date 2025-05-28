const {testTraditionalIoT} = require('./traditional')

const {testBlockchainIoTA} = require('./blockchain-iota')

const {testNativeIoTA} = require('./native-iota')

async function runComparison() {
    const testParams = {
        messageCount: 100,

        deviceCount: 5,

        intervalMs: 500,
    }

    const [traditional, blockchain, native] = await Promise.all([
        testTraditionalIoT(testParams),

        testBlockchainIoTA(testParams),

        testNativeIoTA(testParams),
    ])

    console.log('=== Test Results ===')

    console.table({
        'Traditional IoT': traditional,

        'Blockchain IoTA': blockchain,

        'Native IoTA': native,
    })
}

runComparison()
