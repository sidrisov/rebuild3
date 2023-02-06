import { ethers } from 'hardhat';

const { toUtf8Bytes, keccak256, parseEther, formatEther } = ethers.utils;

import { ProposalExecutedEvent } from '../../typechain-types/contracts/ReBuild3Governor';

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

  console.log(
    "Owner's balance before proposal exectution: ",
    formatEther(await token.balanceOf(owner.address))
  );

  const tx = await governor.execute(
    [token.address],
    [0],
    [token.interface.encodeFunctionData('mint', [owner.address, parseEther('25000')])],
    keccak256(toUtf8Bytes('Give the owner more tokens!'))
  );

  const receipt = await tx.wait();
  const proposalExecutedEvent = receipt?.events?.find((x) => x.event === 'ProposalExecuted');
  const { proposalId } = (proposalExecutedEvent as ProposalExecutedEvent)?.args;

  console.log(`event ProposalExecuted(proposalId: ${proposalId})`);
  console.log(
    "Owner's balance after proposal exectution: ",
    formatEther(await token.balanceOf(owner.address))
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
