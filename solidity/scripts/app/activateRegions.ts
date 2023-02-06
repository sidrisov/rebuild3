import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

const regions = ['Ukraine', 'USA', 'UK'];
async function main() {
  const [owner] = await ethers.getSigners();

  const contract = await ethers.getContractAt('ReBuild3', process.env.CONTRACT_ADDR, owner);
  console.log(
    `Activating regions in contract: ${contract.address}: ${JSON.stringify(regions, null, 2)}`
  );

  await contract.activateRegions(regions);
  /* regions.forEach(async (region) => {
    await contract.activateRegion(region);
  }); */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
