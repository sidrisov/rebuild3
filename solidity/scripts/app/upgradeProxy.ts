import { ethers, upgrades, run } from 'hardhat';

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDR;
  const ReBuild3 = await ethers.getContractFactory('ReBuild3');

  const upgraded = await upgrades.upgradeProxy(proxyAddress, ReBuild3, { kind: 'uups' });

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  console.log(`ReBuild3 Proxy deployed to ${upgraded.address}`);
  console.log(`ReBuild3 Implementation upgraded to ${implementationAddress}`);

  await run('verify:verify', {
    address: proxyAddress
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
