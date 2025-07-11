// SPDX-License-Identifier: MIT
// Chiliz Spicy Testnet
pragma solidity ^0.8.20;

contract FanClubs {
    struct FanClub {
        address owner;
        uint256 joinPrice;
        address[] members;
        mapping(address => bool) isMember;
    }

    mapping(string => FanClub) private fanClubs;
    mapping(string => bool) private fanClubExists;
    mapping(string => uint256) private fanClubBalances;

    modifier onlyClubOwner(string memory fanClubId) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(msg.sender == fanClubs[fanClubId].owner, "Only fan club owner");
        _;
    }

    function createFanClub(string memory fanClubId, uint256 _price) external {
        require(!fanClubExists[fanClubId], "Fan club already exists");
        require(_price > 0, "Price must be greater than zero");

        FanClub storage newClub = fanClubs[fanClubId];
        newClub.owner = msg.sender;
        newClub.joinPrice = _price;
        newClub.members.push(msg.sender);
        newClub.isMember[msg.sender] = true;

        fanClubExists[fanClubId] = true;
    }

    function join(string memory fanClubId) external payable {
        require(fanClubExists[fanClubId], "Fan club does not exist");

        FanClub storage club = fanClubs[fanClubId];

        require(!club.isMember[msg.sender], "Already a member");
        require(msg.value == club.joinPrice, "Incorrect payment");

        club.members.push(msg.sender);
        club.isMember[msg.sender] = true;

        fanClubBalances[fanClubId] += msg.value;
    }

    function leave(string memory fanClubId) external {
        require(fanClubExists[fanClubId], "Fan club does not exist");

        FanClub storage club = fanClubs[fanClubId];
        require(club.isMember[msg.sender], "Not a member");

        uint256 len = club.members.length;
        for (uint256 i = 0; i < len; i++) {
            if (club.members[i] == msg.sender) {
                club.members[i] = club.members[len - 1];
                club.members.pop();
                break;
            }
        }

        club.isMember[msg.sender] = false;
    }

    function updatePrice(string memory fanClubId, uint256 newPrice) external onlyClubOwner(fanClubId) {
        require(newPrice > 0, "Price must be greater than zero");
        fanClubs[fanClubId].joinPrice = newPrice;
    }

    function getMembers(string memory fanClubId) external view returns (address[] memory) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        return fanClubs[fanClubId].members;
    }

    function checkMember(string memory fanClubId, address user) external view returns (bool) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        return fanClubs[fanClubId].isMember[user];
    }

    function withdraw(string memory fanClubId, uint256 amount) external onlyClubOwner(fanClubId) {
        require(amount > 0, "No balance to withdraw");
        require(fanClubBalances[fanClubId] >= amount, "Insufficient balance");

        fanClubBalances[fanClubId] = fanClubBalances[fanClubId] - amount;
        payable(msg.sender).transfer(amount);
    }

    function getJoinPrice(string memory fanClubId) external view returns (uint256) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        return fanClubs[fanClubId].joinPrice;
    }

    function getOwner(string memory fanClubId) external view returns (address) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        return fanClubs[fanClubId].owner;
    }

    function getBalance(string memory fanClubId) external onlyClubOwner(fanClubId) view returns (uint256) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        return fanClubBalances[fanClubId];
    }
}
