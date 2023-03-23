// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

contract ReBuild3Governor is
  Governor,
  GovernorSettings,
  GovernorCountingSimple,
  GovernorVotes,
  GovernorVotesQuorumFraction
{
  // ~10 mins voting period
  constructor(
    IVotes _token
  )
    Governor("ReBuild3Governor")
    GovernorSettings(1, 50, 0)
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
  {}

  // The following functions are overrides required by Solidity.

  function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
    return super.votingDelay();
  }

  function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
    return super.votingPeriod();
  }

  function quorum(
    uint256 blockNumber
  ) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
    return super.quorum(blockNumber);
  }

  function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
    return super.proposalThreshold();
  }
}
