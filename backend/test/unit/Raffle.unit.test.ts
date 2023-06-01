import { expect, assert } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { network, deployments, ethers } from "hardhat"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", function () {
      let raffle: Raffle
      let deployer: string
      beforeEach(async () => {
        await deployments.fixture(["mocks", "raffle"])
        raffle = await ethers.getContract("Raffle")

        const signers = await ethers.getSigners()
        deployer = signers[0].address
      })

      describe("constructor", function () {
        it("initialize correctly", async () => {
          const state = await raffle.state()
          assert.equal(state, 0)
        })
      })

      describe("enterRaffle", function () {
        it("more money needed", async () => {
          await expect(
            raffle.enterRaffle({
              value: ethers.utils.parseEther("0.0001"),
            })
          ).to.be.revertedWithCustomError(raffle, "MoreMoneyNeeded")
        })

        it("players should be added", async () => {
          await raffle.enterRaffle({
            value: ethers.utils.parseEther("0.1"),
          })
          const player = await raffle.players(0)
          assert.equal(player, deployer)
        })

        it("event should be emitted", async () => {
          const value_ = ethers.utils.parseEther("0.1")
          let txRsp = raffle.enterRaffle({
            value: value_,
          })
          await expect(txRsp).to.be.emit(raffle, "RaffleEntered")
          ;(await txRsp).wait(1)
          assert.equal(
            (await ethers.provider.getBalance(raffle.address)).toString(),
            value_.toString()
          )
        })
      })
    })
