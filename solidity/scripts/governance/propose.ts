import { ethers } from 'hardhat';
import { ProposalCreatedEvent } from '../../typechain-types/contracts/ReBuild3Governor';

const { parseEther } = ethers.utils;
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();

  const governor = await ethers.getContractAt('ReBuild3Governor', process.env.GOV_CONTRACT_ADDR);
  const token = await ethers.getContractAt('ReBuild3Token', process.env.TOKEN_CONTRACT_ADDR);

  console.log(
    `Governor contract address: ${governor.address}`,
    `\nToken contract address: ${token.address}`
  );

  const tx = await governor.propose(
    [token.address],
    [0],
    [token.interface.encodeFunctionData('mint', [owner.address, parseEther('25000')])],
    'Give the owner more tokens!'
  );
  const receipt = await tx.wait();
  const event = receipt?.events?.find((x) => x.event === 'ProposalCreated');
  const { proposalId, description } = (event as ProposalCreatedEvent)?.args;

  console.log(`event ProposalCreated(proposalId: ${proposalId}, description: ${description})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
