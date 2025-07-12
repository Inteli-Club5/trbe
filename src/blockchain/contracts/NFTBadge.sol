// SPDX-License-Identifier: MIT
// Chiliz Spicy Testnet
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBadge is ERC721, Ownable(msg.sender) {
    uint256 private _tokenIds;
    string private _baseTokenURI;

    constructor(string memory name, string memory symbol, string memory initialBaseURI) ERC721(name, symbol) {
        _baseTokenURI = initialBaseURI;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _safeMint(to, newTokenId);
        return newTokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIds;
    }
}
