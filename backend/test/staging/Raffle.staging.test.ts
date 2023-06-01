import { developmentChains } from "../../helper-hardhat-config"
import { network, ethers } from "hardhat"
import { Raffle } from "../../typechain-types"
import { assert, expect } from "chai"

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Test", function () {
      let raffle: Raffle
      let deployer: string
      beforeEach(async () => {
        const signers = await ethers.getSigners()
        deployer = signers[0].address
        raffle = await ethers.getContract("Raffle", deployer)
      })

      describe("whole process", function () {
        it("staging", async function () {
          let promise = new Promise<void>(async (resolve, reject) => {
            raffle.once("WinnerSelected", async () => {
              console.log("winner selected ....")
              try {
                assert.equal(await raffle.winner(), deployer)
                assert.equal(await raffle.state(), 2)

                const withdrawRsp = await raffle.winnerWithdraw()
                await withdrawRsp.wait(1)

                assert.equal(
                  (await ethers.provider.getBalance(raffle.address)).toString(),
                  "0"
                )
                assert.equal(await raffle.state(), 3)

                const resetRsp = await raffle.reset()
                await resetRsp.wait(1)
                assert.equal(await raffle.state(), 0)
                resolve()
              } catch (e) {
                console.log(e)
                reject(e)
              }
            })
          })

          let enterRaffleRsp = raffle.enterRaffle({
            value: ethers.utils.parseEther("0.01"),
          })
          await expect(enterRaffleRsp).to.be.emit(raffle, "RaffleEntered")
          assert.equal(await raffle.players(0), deployer)

          const requestRandomWinnerRsp = await raffle.requestRandomWinner()
          await requestRandomWinnerRsp.wait(1)
          assert.equal(await raffle.state(), 1)
          await promise
        })
      })
    })
