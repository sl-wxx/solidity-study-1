import { useEffect, useState } from "react"
import { contractAddresses, contractABI } from "../constants"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers, BigNumber, ContractTransaction } from "ethers"
import { useNotification } from "@web3uikit/core"

interface contractAddressesInterface {
  [key: string]: string
}

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex!).toString()
  const addresses: contractAddressesInterface = contractAddresses
  const address = addresses[chainId]
  const abi = JSON.parse(contractABI)

  const [entranceFee, setEntranceFee] = useState("0")
  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: address!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: ENTER_FEE } = useWeb3Contract({
    abi: abi,
    contractAddress: address!,
    functionName: "ENTER_FEE",
    params: {},
    msgValue: entranceFee,
  })

  async function updateUI() {
    setEntranceFee(((await ENTER_FEE()) as BigNumber).toString())
  }

  async function handleSuccess(tx: ContractTransaction) {
    await tx.wait(1)
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
    })
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div className="p-5">
      Hi from lottery entrance!
      {address ? (
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
        </div>
      ) : (
        <div>No Raffle Address Deteched</div>
      )}
    </div>
  )
}
