const {composeAPI} = require('@iota/core')

const {trytesToAscii} = require('@iota/converter')

const {MamFactory} = require('@iota/mam.js')

const iota = composeAPI({provider: 'https://nodes.iota.org:443'})

const mam = MamFactory.create(iota)

async function fetchMessages(root, mode, sideKey, limit = 10) {
    const messages = []

    let currentRoot = root

    for (let i = 0; i < limit; i++) {
        const result = await mam.fetch(currentRoot, mode, sideKey)

        if (!result.messages.length) break

        messages.push(
            ...result.messages.map((m) => JSON.parse(trytesToAscii(m)))
        )

        currentRoot = result.nextRoot
    }

    return messages
}

module.exports = {fetchMessages}
