import { ethers } from 'hardhat';
import { DelegateChangedEvent } from '../../typechain-types/contracts/ReBuild3Token';

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

  const tx = await token.delegate(owner.address);

  const receipt = await tx.wait();

  const event = receipt?.events?.find((x) => x.event === 'DelegateChanged');

  const { delegator, fromDelegate, toDelegate } = (event as DelegateChangedEvent)?.args;
  console.log(
    `event DelegateChanged(delegator: ${delegator}, fromDelegate: ${fromDelegate}, toDelegate: ${toDelegate})`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
