const {ethers} = require('ethers')

const {fetchMessages} = require('../iota/native/subscriber')

const BlockchainIoTA = require('../artifacts/contracts/BlockchainIoTA.sol/BlockchainIoTA.json')

// Configuration

const ETH_RPC_URL = 'http://localhost:8545'

const CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' 

const ORACLE_PK =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' 

// Device tracking

const devices = {
    'device-0': {lastRoot: 'EXAMPLEIOTAROOT9...'},
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL)

    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        BlockchainIoTA.abi,
        wallet
    )

    setInterval(async () => {
        for (const deviceId in devices) {
            try {
                const messages = await fetchMessages(
                    devices[deviceId].lastRoot,

                    'restricted',

                    deviceId
                )

                for (const message of messages) {

                    const tx = await contract.verifyIotaData(
                        deviceId,

                        message.value,

                        ethers.utils.keccak256(
                            ethers.utils.toUtf8Bytes(message.messageId)
                        ),

                        ethers.utils.keccak256(
                            ethers.utils.toUtf8Bytes(message.bundleHash)
                        ),

                        3, 

                        '0x' 
                    )

                    console.log(
                        `Verified message from ${deviceId} in tx: ${tx.hash}`
                    )
                }


                if (messages.length) {
                    devices[deviceId].lastRoot =
                        messages[messages.length - 1].root
                }
            } catch (error) {
                console.error(`Error processing device ${deviceId}:`, error)
            }
        }
    }, 30000) 
}

main().catch(console.error)
