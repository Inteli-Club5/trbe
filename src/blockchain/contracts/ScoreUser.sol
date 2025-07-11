// SPDX-License-Identifier: MIT
// Chiliz Spicy Testnet
pragma solidity ^0.8.20;

contract ScoreUser {
    address public owner;
    mapping(address => int256) public reputationUser;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function getReputation(address user) external view returns (int256) {
        return reputationUser[user];
    }

    function calculateReputation(
        address user,
        int256 likes,
        int256 comments,
        int256 retweets,
        int256 hashtag,
        int256 checkEvents,
        int256 gamesId,
        int256 reports
    ) external onlyOwner {
        int256 score = likes + (comments * 2) + retweets + (hashtag * 3) + (checkEvents * 3) + (gamesId * 3) - (reports * 10);
        reputationUser[user] = score;
    }
}
