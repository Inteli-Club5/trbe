// SPDX-License-Identifier: MIT
// Chiliz Spicy Testnet
pragma solidity ^0.8.20;

contract FanClub {
    address public owner;
    uint256 public joinPrice;

    address[] private members;
    mapping(address => bool) private isMember;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(uint256 _price, address _owner) {
        owner = _owner;
        require(_price > 0, "Price must be greater than zero");
        joinPrice = _price;
        members.push(_owner);
        isMember[_owner] = true;
    }

    function updatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than zero");
        joinPrice = newPrice;
    }

    function join() external payable {
        require(!isMember[msg.sender], "Already a member");
        require(msg.value == joinPrice, "Incorrect payment");

        members.push(msg.sender);
        isMember[msg.sender] = true;
    }

    function leave() external {
        require(isMember[msg.sender], "Not a member");

        uint256 len = members.length;
        for (uint256 i = 0; i < len; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[len - 1];
                members.pop();
                break;
            }
        }

        isMember[msg.sender] = false;
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }

    function checkMember(address user) external view returns (bool) {
        return isMember[user];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
