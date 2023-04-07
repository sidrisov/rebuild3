import { ethers, upgrades, run } from 'hardhat';

async function main() {
  const ReBuild3 = await ethers.getContractFactory('ReBuild3');

  // Deploying
  const UUPSProxy = await upgrades.deployProxy(ReBuild3, { kind: 'uups' });
  const proxy = await UUPSProxy.deployed();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);

  console.log(`ReBuild3 Proxy deployed to ${proxy.address}`);
  console.log(`ReBuild3 Implementation deployed to ${implementationAddress}`);

  await run('verify:verify', {
    address: proxy.address
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
