import { ethers } from 'hardhat';

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const RB3Fundraising = await ethers.getContractFactory('RB3Fundraising');
  const contract = await RB3Fundraising.deploy();

  await contract.deployed();

  await contract.setGoalThreshold(ethers.utils.parseEther('1'));

  console.log(`RB3Fundraising deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
