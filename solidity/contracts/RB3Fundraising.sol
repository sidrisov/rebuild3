// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// import "hardhat/console.sol";

import '@openzeppelin/contracts/access/Ownable.sol';

contract RB3Fundraising is Ownable {
  struct Region {
    bool active;
    string name;
  }

  struct Organization {
    bool active;
    address payable account;
    string name;
    string description;
    string region;
  }

  uint256 public goalThreshold = 0;

  Region[] regions;
  mapping(string => uint) regionIds;
  uint activeRegionsCount;

  Organization[] organizations;
  mapping(address => uint) organizationIds;

  // Fundraising request information
  struct Campaign {
    bool active;
    address payable recipient;
    string title;
    string description;
    uint256 goal;
    uint256 fundsRaised;
    bool released;
    string region;
    address organization;
  }

  Campaign[] public campaigns;
  uint public activeCampaigns;

  // Organization events
  event OrganizationRegistered(address indexed organization);
  event OrganizationDeactivated(address indexed organization);

  // Region events
  event RegionActivated(string indexed name);
  event RegionDeactivated(string indexed name);

  // Campaign events
  event CampaignCreated(uint indexed campaignId, address indexed creator);

  // Activate region
  function activateRegion(string memory _name) public onlyOwner {
    require(!isRegion(_name), 'Region already exists!');
    regions.push(Region(true, _name));
    regionIds[_name] = regions.length;
    activeRegionsCount++;
    emit RegionActivated(_name);
  }

  // Deactive region
  function deactivateRegion(string memory _name) public onlyOwner {
    require(isRegion(_name), "Region doesn't exist!");
    uint id = regionIds[_name] - 1;
    require(regions[id].active, 'Region is not active already!');
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
    require(!isOrganization(_organization), 'Organization already exists!');
    require(isRegionActive(_region), 'Region is not active!');
    organizations.push(Organization(true, payable(_organization), _name, _description, _region));
    organizationIds[_organization] = organizations.length;
    emit OrganizationRegistered(_organization);
  }

  // Set organization to active = false;
  function deactivateOrganization(address _organization) public onlyOwner {
    require(isOrganization(_organization), "Organization doesn't exist!");
    uint id = organizationIds[_organization] - 1;
    require(organizations[id].active, 'Organization is not active already!');
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
    require(isRegionActive(_region), 'Region is not active!');
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
    uint256 _goal,
    string memory _region,
    address _organization
  ) external {
    require(isRegionActive(_region), 'Region is not active!');
    require(isOrganizationActive(_organization), 'Organization is not active!');
    require(_goal <= goalThreshold, "You can't raise more than allowed threshold!");

    campaigns.push(
      Campaign(
        false,
        payable(msg.sender),
        _title,
        _description,
        _goal,
        0,
        false,
        _region,
        _organization
      )
    );

    emit CampaignCreated(campaigns.length - 1, msg.sender);
  }

  function setGoalThreshold(uint256 _threshold) external onlyOwner {
    goalThreshold = _threshold;
  }

  // Get all campaigns
  function getAllCampaigns() external view returns (Campaign[] memory) {
    return campaigns;
  }
}
