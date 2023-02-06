import { ethers } from 'hardhat';
import dotenv from 'dotenv';
import { VoteCastEvent } from '../../typechain-types/contracts/ReBuild3Governor';

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();

  const governor = await ethers.getContractAt('ReBuild3Governor', process.env.GOV_CONTRACT_ADDR);
  const token = await ethers.getContractAt('ReBuild3Token', process.env.TOKEN_CONTRACT_ADDR);

  console.log(
    `Governor contract address: ${governor.address}`,
    `\nToken contract address: ${token.address}`
  );

  const tx = await governor.castVote(process.env.PROPOSAL_ID, 1);
  const receipt = await tx.wait();
  const voteCastEvent = receipt?.events?.find((x) => x.event === 'VoteCast');

  const { voter, proposalId, support } = (voteCastEvent as VoteCastEvent).args;

  console.log(`event VoteCast(voter: ${voter} voted for: ${proposalId} with ${support})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
