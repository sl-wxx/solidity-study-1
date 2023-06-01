// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Raffle is VRFConsumerBaseV2 {
  event RaffleEntered();
  event WinnerSelected(address indexed winner);

  error MoreMoneyNeeded();
  error InvalidState();

  enum State {
    Open,
    Lottery,
    Wait_Withdraw,
    Withdrawn
  }

  address public owner;

  address[] public players;

  address public winner;

  /* VRF related */
  VRFCoordinatorV2Interface private immutable vrfCoordinator;
  bytes32 private immutable keyHash;
  uint64 private immutable subscriptionId;
  uint32 private immutable callbackGasLimit;

  State public state;

  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;
  uint256 public constant ENTER_FEE = 0.01 ether;

  constructor(
    address vrfAddress,
    bytes32 keyHash_,
    uint64 subscriptionId_,
    uint32 callbackGasLimit_
  ) VRFConsumerBaseV2(vrfAddress) {
    vrfCoordinator = VRFCoordinatorV2Interface(vrfAddress);
    keyHash = keyHash_;
    subscriptionId = subscriptionId_;
    callbackGasLimit = callbackGasLimit_;
    owner = msg.sender;
  }

  function enterRaffle() external payable inState(State.Open) {
    if (msg.value < ENTER_FEE) {
      revert MoreMoneyNeeded();
    }

    players.push(msg.sender);
    emit RaffleEntered();
  }

  function requestRandomWinner()
    external
    inState(State.Open)
    onlyOwner
    returns (uint256 requestId)
  {
    state = State.Lottery;
    requestId = vrfCoordinator.requestRandomWords(
      keyHash,
      subscriptionId,
      REQUEST_CONFIRMATIONS,
      callbackGasLimit,
      NUM_WORDS
    );
  }

  function fulfillRandomWords(
    uint256 /* requestId */,
    uint256[] memory randomWords
  ) internal override inState(State.Lottery) {
    state = State.Wait_Withdraw;
    winner = players[randomWords[0] % players.length];
    emit WinnerSelected(winner);
  }

  function winnerWithdraw() external inState(State.Wait_Withdraw) {
    require(msg.sender == winner, "Not Winner");
    state = State.Withdrawn;
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success, "transfer balance to winner fail");
  }

  function reset() external inState(State.Withdrawn) onlyOwner {
    state = State.Open;
  }

  modifier inState(State _state) {
    if (state != _state) {
      revert InvalidState();
    }
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not Owner");
    _;
  }
}
