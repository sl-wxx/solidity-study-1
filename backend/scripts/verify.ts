import { run } from "hardhat"

const verify = async (contractAddress: string, contractArgs: any[]) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: contractArgs,
    })
    console.log("verify success!")
  } catch (e: any) {
    console.log(e)
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified!")
    } else {
      console.log(e)
    }
  }
}

export default verify
