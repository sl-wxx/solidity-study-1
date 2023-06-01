import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { VRFCoordinatorV2Mock } from "../typechain-types"
import verify from "../scripts/verify"
import "dotenv/config"

const deployRaffle: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const networkName = hre.network.name
  const networkConf = networkConfig[networkName]
  const deployer = (await hre.getNamedAccounts()).deployer

  let vrfAddress, subscriptionId
  if (developmentChains.includes(networkName)) {
    const vrf: VRFCoordinatorV2Mock = await hre.ethers.getContract(
      "VRFCoordinatorV2Mock",
      deployer
    )
    vrfAddress = vrf.address
    const txRsp = await vrf.createSubscription()
    const txReceipt = await txRsp.wait()
    subscriptionId = txReceipt.events![0].args!.subId

    await vrf.fundSubscription(subscriptionId, 10 ^ 18)
  } else {
    vrfAddress = networkConf.vrfCoordinatorV2
    subscriptionId = networkConf.subscriptionId
  }

  const constructorArgs = [
    vrfAddress,
    networkConf.gasLane,
    subscriptionId,
    networkConf.callbackGasLimit,
  ]

  const deployResult = await hre.deployments.deploy("Raffle", {
    from: deployer,
    args: constructorArgs,
    log: true,
  })

  const etherscanApiKey = process.env.ETHERSCAN_API_KEY
  if (!developmentChains.includes(networkName) && etherscanApiKey) {
    console.log(`verify Raffle at ${deployResult.address}`)
    await verify(deployResult.address, constructorArgs)
  }
}

deployRaffle.tags = ["all", "raffle"]
export default deployRaffle
