import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  });

  const ReBuild3Governor = await ethers.getContractFactory('ReBuild3Governor');
  const governor = await ReBuild3Governor.deploy(futureAddress);

  const ReBuild3Token = await ethers.getContractFactory('ReBuild3Token');
  const token = await ReBuild3Token.deploy(governor.address);

  console.log(`Governor deployed to ${governor.address}`, `\nToken deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
