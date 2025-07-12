// SPDX-License-Identifier: MIT
// Chiliz Spicy Testnet
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}


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
    mapping(string => mapping(address => uint256[])) private fanClubNFTs;
    mapping(string => mapping(address => uint256)) private fanTokenBalances; 

    struct MarketplaceItem {
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        bool isListed;
    }

    string[] private fanClubIds;
    mapping(string => address) private fanToken;
    mapping(string => MarketplaceItem[]) private marketplaceListings;
    mapping(string => mapping(address => mapping(uint256 => bool))) private isNFTListed;

    modifier onlyClubOwner(string memory fanClubId) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(msg.sender == fanClubs[fanClubId].owner, "Only fan club owner");
        _;
    }

    constructor() {}

    // Fan club functions

    function getAllFanClubIds() external view returns (string[] memory) {
        return fanClubIds;
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
        fanClubIds.push(fanClubId);
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

        fanClubBalances[fanClubId] -= amount;
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

    // Fan token functions

    function depositFanTokens(string memory fanClubId, address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        bool success = IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        fanTokenBalances[fanClubId][tokenAddress] += amount;
    }

    function withdrawFanTokens(string memory fanClubId, address tokenAddress, uint256 amount) external onlyClubOwner(fanClubId) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(fanTokenBalances[fanClubId][tokenAddress] >= amount, "Insufficient token balance");

        fanTokenBalances[fanClubId][tokenAddress] -= amount;
        bool success = IERC20(tokenAddress).transfer(msg.sender, amount);
        require(success, "Token withdrawal failed");
    }

    function rewardFanToken(string memory fanClubId, address tokenAddress, address recipient, uint256 amount) external onlyClubOwner(fanClubId) {
        require(amount > 0, "Amount must be greater than 0");
        require(fanTokenBalances[fanClubId][tokenAddress] >= amount, "Insufficient token balance");

        fanTokenBalances[fanClubId][tokenAddress] -= amount;
        bool success = IERC20(tokenAddress).transfer(recipient, amount);
        require(success, "Token reward failed");
    }

    function getFanTokenBalance(string memory fanClubId, address tokenAddress) external onlyClubOwner(fanClubId) view returns (uint256) {
        return fanTokenBalances[fanClubId][tokenAddress];
    }

    // Fan NFT functions

    function depositFanNFT(string memory fanClubId, address nftAddress, uint256 tokenId) external {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(nftAddress != address(0), "Invalid NFT contract");

        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        fanClubNFTs[fanClubId][nftAddress].push(tokenId);
    }

    function withdrawFanNFT(string memory fanClubId, address nftAddress, uint256 tokenId) external onlyClubOwner(fanClubId) {
        require(fanClubExists[fanClubId], "Fan club does not exist");

        uint256[] storage tokenList = fanClubNFTs[fanClubId][nftAddress];
        bool found = false;
        uint256 index;

        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == tokenId) {
                found = true;
                index = i;
                break;
            }
        }

        require(found, "Token not found for this fan club");

        tokenList[index] = tokenList[tokenList.length - 1];
        tokenList.pop();

        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
    }

    function rewardFanNFT(string memory fanClubId, address nftAddress, address recipient, uint256 tokenId) external onlyClubOwner(fanClubId) {
        require(recipient != address(0), "Invalid recipient");
        require(fanClubExists[fanClubId], "Fan club does not exist");

        uint256[] storage tokenList = fanClubNFTs[fanClubId][nftAddress];
        bool found = false;
        uint256 index;

        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == tokenId) {
                found = true;
                index = i;
                break;
            }
        }

        require(found, "Token not owned by fan club");

        tokenList[index] = tokenList[tokenList.length - 1];
        tokenList.pop();

        IERC721(nftAddress).transferFrom(address(this), recipient, tokenId);
    }

    function getFanNFT(string memory fanClubId, address nftAddress, uint256 tokenId) public view returns (bool) {
        require(fanClubExists[fanClubId], "Fan club does not exist");

        uint256[] storage tokenList = fanClubNFTs[fanClubId][nftAddress];
        bool found = false;

        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == tokenId) {
                found = true;
                break;
            }
        }

        return found;
    }

    // Marketplace functions

    function createMarketplace(string memory fanClubId, address tokenAddress) external onlyClubOwner(fanClubId) {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(tokenAddress != address(0), "Invalid token address");
        require(fanToken[fanClubId] == address(0), "Marketplace already exists");

        fanToken[fanClubId] = tokenAddress;
    }

    function listItem(string memory fanClubId, address nftAddress, uint256 tokenId, uint256 price) external onlyClubOwner(fanClubId) {
        require(price > 0, "Price must be greater than 0");
        require(getFanNFT(fanClubId, nftAddress, tokenId), "NFT not held by fan club");
        require(!isNFTListed[fanClubId][nftAddress][tokenId], "Already listed");

        MarketplaceItem memory newItem = MarketplaceItem({
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
            isListed: true
        });

        marketplaceListings[fanClubId].push(newItem);
        isNFTListed[fanClubId][nftAddress][tokenId] = true;
    }

    function delistItem(string memory fanClubId, address nftAddress, uint256 tokenId) external onlyClubOwner(fanClubId) {
        uint256 len = marketplaceListings[fanClubId].length;

        for (uint256 i = 0; i < len; i++) {
            if (
                marketplaceListings[fanClubId][i].nftAddress == nftAddress &&
                marketplaceListings[fanClubId][i].tokenId == tokenId &&
                marketplaceListings[fanClubId][i].isListed
            ) {
                marketplaceListings[fanClubId][i].isListed = false;
                isNFTListed[fanClubId][nftAddress][tokenId] = false;
                break;
            }
        }
    }

    function buy(string memory fanClubId, address nftAddress, uint256 tokenId) external {
        require(fanClubExists[fanClubId], "Fan club does not exist");
        require(fanClubs[fanClubId].isMember[msg.sender], "Only members can buy");
        require(isNFTListed[fanClubId][nftAddress][tokenId], "Item not listed");

        address token = fanToken[fanClubId];
        require(token != address(0), "Marketplace not initialized");

        MarketplaceItem[] storage items = marketplaceListings[fanClubId];
        uint256 index = type(uint256).max;
        uint256 price;

        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i].nftAddress == nftAddress &&
                items[i].tokenId == tokenId &&
                items[i].isListed
            ) {
                index = i;
                price = items[i].price;
                break;
            }
        }

        require(index != type(uint256).max, "Item not found");

        bool success = IERC20(token).transferFrom(msg.sender, fanClubs[fanClubId].owner, price);
        require(success, "Payment failed");

        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        items[index].isListed = false;
        isNFTListed[fanClubId][nftAddress][tokenId] = false;

        uint256[] storage tokenList = fanClubNFTs[fanClubId][nftAddress];
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == tokenId) {
                tokenList[i] = tokenList[tokenList.length - 1];
                tokenList.pop();
                break;
            }
        }
    }

    function getItems(string memory fanClubId) external view returns (MarketplaceItem[] memory) {
        return marketplaceListings[fanClubId];
    }
}