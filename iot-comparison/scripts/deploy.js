const {ethers} = require('hardhat')

async function main() {
    const [owner, oracle] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', owner.address)

    const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
    const iot = await TraditionalIoT.deploy()
    await iot.deployed()

    console.log('TraditionalIoT deployed to:', iot.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
