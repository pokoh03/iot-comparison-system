const {publishData} = require('../iota/publisher')

describe('Native IOTA Performance', function () {
    it('Test Native IOTA performance', async function () {
        const start = Date.now()
        for (let i = 0; i < 10; i++) {
            await publishData(`device-${i % 3}`, i)
        }
        const duration = Date.now() - start

        console.log(`Native IOTA: 10 transactions in ${duration}ms`)
    })
})
