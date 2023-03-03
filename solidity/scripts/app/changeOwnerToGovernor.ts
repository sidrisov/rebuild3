import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();

  const contract = await ethers.getContractAt('ReBuild3', process.env.CONTRACT_ADDR, owner);
  console.log(
    `Changing contract: ${contract.address} owner to governor: ${process.env.GOV_CONTRACT_ADDR}`
  );

  await contract.transferOwnership(process.env.GOV_CONTRACT_ADDR);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
