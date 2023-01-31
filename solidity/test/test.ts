import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('RB3Fundraising', function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RB3Fundraising = await ethers.getContractFactory('RB3Fundraising');
    const contract = await RB3Fundraising.deploy();

    return { contract, owner, addr1, addr2 };
  }

  async function deployFixtureWithRegion() {
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RB3Fundraising = await ethers.getContractFactory('RB3Fundraising');
    const contract = await RB3Fundraising.deploy();

    await contract.activateRegion('Ukraine');

    return { contract, owner, addr1, addr2 };
  }

  async function deployFixtureWithRegionAndOrg() {
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RB3Fundraising = await ethers.getContractFactory('RB3Fundraising');
    const contract = await RB3Fundraising.deploy();

    await contract.activateRegion('Ukraine');
    await contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine');

    return { contract, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it('No regions active on initial deployment', async function () {
      const { contract } = await loadFixture(deployFixture);

      expect((await contract.getActiveRegions()).length).to.equal(0);
    });

    it('No organizations active on initial deployment', async function () {
      const { contract } = await loadFixture(deployFixture);

      expect((await contract.getAllOrganizations()).length).to.equal(0);
    });
  });

  describe('Regions', function () {
    it('Region added successfully', async function () {
      const { contract } = await loadFixture(deployFixture);

      await contract.activateRegion('Ukraine');

      expect((await contract.getActiveRegions()).length).to.equal(1);
      expect((await contract.getActiveRegions())[0]).to.equal('Ukraine');
    });

    it('Duplicates not allowed', async function () {
      const { contract } = await loadFixture(deployFixture);

      await contract.activateRegion('Ukraine');

      await expect(contract.activateRegion('Ukraine')).to.be.revertedWith('Region already exists!');
    });

    it('Region deactivated successfully', async function () {
      const { contract } = await loadFixture(deployFixture);

      await expect(contract.deactivateRegion('Ukraine')).to.be.revertedWith(
        "Region doesn't exist!"
      );

      await contract.activateRegion('Ukraine');

      await contract.deactivateRegion('Ukraine');

      expect((await contract.getActiveRegions()).length).to.equal(0);
    });
  });

  describe('Organizations', function () {
    it('Organization added successfully', async function () {
      const { contract, addr1 } = await loadFixture(deployFixture);

      await expect(
        contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine')
      ).to.be.revertedWith('Region is not active!');

      await contract.activateRegion('Ukraine');

      await contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine');

      expect((await contract.getAllOrganizations()).length).to.equal(1);
    });

    it('Duplicate organizations not allowed', async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployFixtureWithRegion);

      await contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine');

      await expect(
        contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine')
      ).to.be.revertedWith('Organization already exists!');

      await contract.registerOrganization(addr2.address, 'org1', 'desc1', 'Ukraine');

      expect((await contract.getAllOrganizations()).length).to.be.equal(2);
    });

    it('Organization deactivated successfully', async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployFixtureWithRegion);

      await expect(contract.deactivateOrganization(addr1.address)).to.be.revertedWith(
        "Organization doesn't exist!"
      );

      await contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine');

      await contract.deactivateOrganization(addr1.address);

      expect((await contract.getAllOrganizations())[0].active).to.be.false;
    });
  });

  describe('Campaigns', function () {
    it("Campaign can't be added", async function () {
      const { contract, addr1 } = await loadFixture(deployFixture);

      await expect(
        contract.submitCampaign('Campaign1', 'Campaign1', 10000, 'Ukraine', addr1.address)
      ).to.be.revertedWith('Region is not active!');

      await contract.activateRegion('Ukraine');

      await expect(
        contract.submitCampaign('Campaign1', 'Campaign1', 10000, 'Ukraine', addr1.address)
      ).to.be.revertedWith('Organization is not active!');

      await contract.registerOrganization(addr1.address, 'org1', 'desc1', 'Ukraine');

      await contract.deactivateOrganization(addr1.address);

      await expect(
        contract.submitCampaign('Campaign1', 'Campaign1', 10000, 'Ukraine', addr1.address)
      ).to.be.revertedWith('Organization is not active!');

      expect((await contract.getAllCampaigns()).length).to.be.equal(0);
    });

    it('Campaign added successfully', async function () {
      const { contract, addr1 } = await loadFixture(deployFixtureWithRegionAndOrg);

      await contract.submitCampaign('Campaign1', 'Campaign1', 10000, 'Ukraine', addr1.address);

      expect((await contract.getAllCampaigns()).length).to.be.equal(1);
      expect((await contract.getAllCampaigns())[0].active).to.be.false;
    });
  });
});
