import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

const organizations = [
  { name: 'ORG1', description: 'We Rebuild in Ukraine', region: 'Ukraine' },
  { name: 'ORG2', description: 'We Rebuild in USA', region: 'USA' },
  { name: 'ORG3', description: 'We Rebuild in UK', region: 'UK' }
];
async function main() {
  const signers = await ethers.getSigners();
  const contract = await ethers.getContractAt(
    'RB3Fundraising',
    process.env.CONTRACT_ADDR,
    signers[0]
  );

  console.log(
    `Registring organizations in contract: ${contract.address}: ${JSON.stringify(
      organizations,
      null,
      2
    )}`
  );

  organizations.forEach(async (org, i) => {
    await contract.registerOrganization(signers[i].address, org.name, org.description, org.region);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
