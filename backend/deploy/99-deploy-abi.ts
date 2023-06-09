import fs from "fs"
import { ethers, network } from "hardhat"
import {
  CONTRACT_ADDRESS_PATH_FOR_FRONTEND,
  ABI_PATH_FOR_FRONTEND,
} from "../helper-hardhat-config"

const deployAbi = async function () {
  console.log("write abi/address to frontend folder ...")
  const raffle = await ethers.getContract("Raffle")
  const oldAddressesString = fs.readFileSync(
    CONTRACT_ADDRESS_PATH_FOR_FRONTEND,
    "utf-8"
  )
  const oldAddresses = oldAddressesString ? JSON.parse(oldAddressesString) : {}
  const chainId = network.config.chainId!
  oldAddresses[chainId] = raffle.address
  fs.writeFileSync(
    CONTRACT_ADDRESS_PATH_FOR_FRONTEND,
    JSON.stringify(oldAddresses),
    "utf-8"
  )

  const json: string = ethers.utils.FormatTypes["json"]
  const abi = raffle.interface.format(json)
  fs.writeFileSync(ABI_PATH_FOR_FRONTEND, JSON.stringify(abi), "utf-8")
}

deployAbi.tags = ["all", "abi"]
export default deployAbi
