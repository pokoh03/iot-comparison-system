const {ethers} = require('hardhat')

async function main() {
    const [owner, oracle] = await ethers.getSigners()

    // Deploy Traditional IoT
    const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
    const iot = await TraditionalIoT.deploy()
    await iot.deployed()

    // Deploy Blockchain IoTA
    const BlockchainIoTA = await ethers.getContractFactory('BlockchainIoTA')
    const iota = await BlockchainIoTA.deploy(oracle.address)
    await iota.deployed()

    console.log('TraditionalIoT deployed to:', iot.address)
    console.log('BlockchainIoTA deployed to:', iota.address)
    console.log('Oracle address:', oracle.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
