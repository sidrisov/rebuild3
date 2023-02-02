cd ../
npx hardhat run scripts/deploy.ts --network localhost
npx hardhat run scripts/activateRegions.ts --network localhost
npx hardhat run scripts/registerOrganizations.ts --network localhost
