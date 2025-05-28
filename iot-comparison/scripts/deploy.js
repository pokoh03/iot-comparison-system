const {ethers} = require('hardhat')

async function main() {
    const [owner, oracle] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', owner.address)

    const TraditionalIoT = await ethers.getContractFactory('TraditionalIoT')
    const iot = await TraditionalIoT.deploy()

    // In ethers v6, use waitForDeployment() instead of deployed()
    await iot.waitForDeployment()

    // Use .target instead of .address in ethers v6
    console.log('TraditionalIoT deployed to:', iot.target)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
