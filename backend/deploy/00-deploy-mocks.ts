import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains } from "../helper-hardhat-config"

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    // only development chains need mock
    if (!developmentChains.includes(hre.network.name)) {
        return
    }

    const deployer = (await hre.getNamedAccounts()).deployer
    await hre.deployments.deploy("VRFCoordinatorV2Mock", {
        from: deployer,
        args: ["250000000000000000", 10 ^ 9],
        log: true,
    })
}

deployMocks.tags = ["all", "mocks"]
export default deployMocks
