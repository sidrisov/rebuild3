import { ethers } from 'hardhat';

async function main() {
  const ReBuild3 = await ethers.getContractFactory('ReBuild3');
  const contract = await ReBuild3.deploy();

  await contract.deployed();

  await contract.setGoalThreshold(ethers.utils.parseEther('1'));

  console.log(`ReBuild3 deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
