// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReBuild3 is Ownable {
  struct Region {
    bool active;
    string name;
  }

  struct Organization {
    bool active;
    address account;
    string name;
    string description;
    string region;
  }

  // Fundraising request information
  struct Campaign {
    bool active;
    address owner;
    string title;
    string description;
    string cid;
    uint256 goal;
    uint256 raised;
    uint donated;
    bool released;
    string region;
    address organization;
  }

  struct Donation {
    uint campaignId;
    address donor;
    uint256 timestamp;
    uint256 amount;
    bool released;
    bool returned;
  }

  uint256 public goalThreshold = 0;

  Region[] regions;
  mapping(string => uint) regionIds;
  uint activeRegionsCount;

  Organization[] organizations;
  mapping(address => uint) organizationIds;

  Campaign[] public campaigns;
  uint public activeCampaigns;

  Donation[] donations;
  mapping(uint => uint[]) donatedTo;
  mapping(address => uint[]) donatedBy;

  // Organization events
  event OrganizationRegistered(address indexed organization);
  event OrganizationDeactivated(address indexed organization);

  // Region events
  event RegionActivated(string indexed name);
  event RegionDeactivated(string indexed name);

  // Campaign events
  event CampaignCreated(uint indexed campaignId, address indexed owner);
  event CampaignActive(uint indexed campaignId);
  event DonationMade(uint indexed campaignId, address indexed donor, uint256 indexed amount);
  event CampaignSuccess(uint indexed campaignId, address indexed receiver, uint256 amount);

  // Activate region
  function activateRegion(string memory _region) public onlyOwner {
    require(!isRegion(_region), "Region already exists!");
    regions.push(Region(true, _region));
    regionIds[_region] = regions.length;
    activeRegionsCount++;
    emit RegionActivated(_region);
  }

  function activateRegions(string[] memory _regions) public onlyOwner {
    for (uint i = 0; i < _regions.length; i++) {
      activateRegion(_regions[i]);
    }
  }

  // Deactive region
  function deactivateRegion(string memory _name) public onlyOwner {
    require(isRegion(_name), "Region doesn't exist!");
    uint id = regionIds[_name] - 1;
    require(regions[id].active, "Region is not active already!");
    regions[id].active = false;
    activeRegionsCount--;
    emit RegionDeactivated(_name);
  }

  // Register an organization
  function registerOrganization(
    address _organization,
    string memory _name,
    string memory _description,
    string memory _region
  ) public onlyOwner {
    require(!isOrganization(_organization), "Organization already exists!");
    require(isRegionActive(_region), "Region is not active!");
    organizations.push(Organization(true, _organization, _name, _description, _region));
    organizationIds[_organization] = organizations.length;
    emit OrganizationRegistered(_organization);
  }

  // Set organization to active = false;
  function deactivateOrganization(address _organization) public onlyOwner {
    require(isOrganization(_organization), "Organization doesn't exist!");
    uint id = organizationIds[_organization] - 1;
    require(organizations[id].active, "Organization is not active already!");
    organizations[id].active = false;
    emit OrganizationDeactivated(_organization);
  }

  // Check if an organization exists
  function isOrganization(address _organization) internal view returns (bool) {
    return organizationIds[_organization] != 0;
  }

  // Check if an organization is active
  function isOrganizationActive(address _organization) internal view returns (bool) {
    return
      organizationIds[_organization] != 0 &&
      organizations[organizationIds[_organization] - 1].active;
  }

  // Check if an region exists
  function isRegion(string memory _name) internal view returns (bool) {
    return regionIds[_name] != 0;
  }

  // Check if an region active
  function isRegionActive(string memory _name) internal view returns (bool) {
    return regionIds[_name] != 0 && regions[regionIds[_name] - 1].active;
  }

  // Get all active regions
  function getActiveRegions() public view returns (string[] memory) {
    string[] memory activeRegions = new string[](activeRegionsCount);
    uint count = 0;
    for (uint i = 0; i < regions.length; i++) {
      if (regions[i].active) {
        activeRegions[count] = regions[i].name;
        count++;
      }
    }
    return activeRegions;
  }

  // Get organizations operating in the region
  function getOrganizationsInRegion(
    string memory _region
  ) public view returns (Organization[] memory) {
    require(isRegionActive(_region), "Region is not active!");
    Organization[] memory orgs = new Organization[](organizations.length);
    uint count = 0;
    for (uint i = 0; i < organizations.length; i++) {
      if (organizations[i].active) {
        orgs[count] = organizations[i];
        count++;
      }
    }
    return orgs;
  }

  // Get all organizations
  function getAllOrganizations() external view returns (Organization[] memory) {
    return organizations;
  }

  function submitCampaign(
    string memory _title,
    string memory _description,
    string memory _cid,
    uint256 _goal,
    string memory _region,
    address _organization
  ) external {
    require(isRegionActive(_region), "Region is not active!");
    require(isOrganizationActive(_organization), "Organization is not active!");
    require(_goal <= goalThreshold, "You can't raise more than allowed threshold!");
    require(msg.sender != _organization, "Campaign creator and organization can't be same!");

    // TODO: add check so that region and organization should match available
    campaigns.push(
      Campaign(
        false,
        msg.sender,
        _title,
        _description,
        _cid,
        _goal,
        0,
        0,
        false,
        _region,
        _organization
      )
    );

    emit CampaignCreated(campaigns.length - 1, msg.sender);
  }

  function approveCampaign(uint _campaignId) external {
    require(_campaignId < campaigns.length, "Campaign doesn't exist!");

    require(!campaigns[_campaignId].active, "Campaign is approved already!");
    require(campaigns[_campaignId].organization == msg.sender, "Not allowed to approve!");

    campaigns[_campaignId].active = true;
    emit CampaignActive(_campaignId);
  }

  function donate(uint _campaignId) external payable {
    require(_campaignId < campaigns.length, "Campaign doesn't exist!");
    require(
      campaigns[_campaignId].active && !campaigns[_campaignId].released,
      "Campaign is not open for donation!"
    );

    address donor = msg.sender;
    uint256 amount = msg.value;

    donations.push(Donation(_campaignId, donor, block.timestamp, amount, false, false));

    uint donationId = donations.length - 1;

    donatedTo[_campaignId].push(donationId);
    donatedBy[donor].push(donationId);
    campaigns[_campaignId].raised += amount;
    campaigns[_campaignId].donated += 1;

    emit DonationMade(_campaignId, msg.sender, amount);
  }

  function release(uint _campaignId) external {
    require(_campaignId < campaigns.length, "Campaign doesn't exist!");
    require(
      campaigns[_campaignId].active && !campaigns[_campaignId].released,
      "Campaign is not open for donation!"
    );

    require(
      campaigns[_campaignId].raised >= campaigns[_campaignId].goal,
      "The goal amount is not raised!"
    );

    campaigns[_campaignId].released = true;

    for (uint i = 0; i < donatedTo[_campaignId].length; i++) {
      uint donationId = donatedTo[_campaignId][i];
      donations[donationId].released = true;
    }

    (bool sent, ) = payable(campaigns[_campaignId].owner).call{
      value: campaigns[_campaignId].raised
    }("");
    require(sent, "Failed to release funds!");

    emit CampaignSuccess(_campaignId, campaigns[_campaignId].owner, campaigns[_campaignId].raised);
  }

  function setGoalThreshold(uint256 _threshold) external onlyOwner {
    goalThreshold = _threshold;
  }

  // Get all campaigns
  function getAllCampaigns() external view returns (Campaign[] memory) {
    return campaigns;
  }

  // get donations for campaign
  function getCampaignDonations(uint _campaignId) external view returns (Donation[] memory) {
    require(_campaignId < campaigns.length, "Campaign doesn't exist!");
    Donation[] memory campaignDonations = new Donation[](donatedTo[_campaignId].length);
    for (uint i = 0; i < donatedTo[_campaignId].length; i++) {
      uint donationId = donatedTo[_campaignId][i];
      campaignDonations[i] = donations[donationId];
    }
    return campaignDonations;
  }

  // get donations for address
  function getAddressDonations(address _donor) external view returns (Donation[] memory) {
    Donation[] memory addressDonations = new Donation[](donatedBy[_donor].length);
    for (uint i = 0; i < donatedBy[_donor].length; i++) {
      uint donationId = donatedBy[_donor][i];
      addressDonations[i] = donations[donationId];
    }
    return addressDonations;
  }
}
