export interface NetworkConfigItem {
  subscriptionId?: string
  gasLane?: string
  callbackGasLimit?: string
  vrfCoordinatorV2?: string
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem
}

export const networkConfig: NetworkConfigInfo = {
  hardhat: {
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
  },
  localhost: {
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
  },
  sepolia: {
    subscriptionId: "2452",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "400000",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
  },
}

export const developmentChains = ["hardhat", "localhost"]
