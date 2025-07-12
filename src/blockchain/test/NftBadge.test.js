const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTBadge", function () {
  let nftBadge;
  let owner;
  let user1;
  let user2;
  let addrs;

  const name = "TRBE Badge";
  const symbol = "TRBE";
  const baseURI = "https://api.trbe.com/badges/";

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    const NFTBadge = await ethers.getContractFactory("NFTBadge");
    nftBadge = await NFTBadge.deploy(name, symbol, baseURI);
  });

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      expect(await nftBadge.name()).to.equal(name);
      expect(await nftBadge.symbol()).to.equal(symbol);
    });

    it("Should set the correct owner", async function () {
      expect(await nftBadge.owner()).to.equal(owner.address);
    });

    it("Should start with zero total minted", async function () {
      expect(await nftBadge.totalMinted()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFT", async function () {
      await expect(nftBadge.connect(owner).mint(user1.address))
        .to.emit(nftBadge, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, 1);

      expect(await nftBadge.ownerOf(1)).to.equal(user1.address);
      expect(await nftBadge.totalMinted()).to.equal(1);
    });

    it("Should increment token ID correctly", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(owner).mint(user2.address);

      expect(await nftBadge.ownerOf(1)).to.equal(user1.address);
      expect(await nftBadge.ownerOf(2)).to.equal(user2.address);
      expect(await nftBadge.totalMinted()).to.equal(2);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(nftBadge.connect(user1).mint(user2.address))
        .to.be.revertedWithCustomError(nftBadge, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should return the correct token ID when minting", async function () {
      const tx = await nftBadge.connect(owner).mint(user1.address);
      const receipt = await tx.wait();
      expect(await nftBadge.totalMinted()).to.equal(1);
    });

    it("Should handle minting to zero address", async function () {
      await expect(nftBadge.connect(owner).mint(ethers.ZeroAddress))
        .to.be.reverted;
    });
  });

  describe("Token URI", function () {
    beforeEach(async function () {
      await nftBadge.connect(owner).mint(user1.address);
    });

    it("Should return correct token URI", async function () {
      const tokenURI = await nftBadge.tokenURI(1);
      expect(tokenURI).to.equal(baseURI + "1");
    });

    it("Should fail for non-existent token", async function () {
      await expect(nftBadge.tokenURI(999))
        .to.be.reverted;
    });

    it("Should return correct base URI", async function () {
      // This tests the internal _baseURI function indirectly
      const tokenURI = await nftBadge.tokenURI(1);
      expect(tokenURI).to.include(baseURI);
    });
  });

  describe("ERC721 Standard Functions", function () {
    beforeEach(async function () {
      await nftBadge.connect(owner).mint(user1.address);
    });

    it("Should return correct owner of token", async function () {
      expect(await nftBadge.ownerOf(1)).to.equal(user1.address);
    });

    it("Should return correct balance of address", async function () {
      expect(await nftBadge.balanceOf(user1.address)).to.equal(1);
      expect(await nftBadge.balanceOf(user2.address)).to.equal(0);
    });

    it("Should allow transfer of token", async function () {
      await nftBadge.connect(user1).transferFrom(user1.address, user2.address, 1);
      expect(await nftBadge.ownerOf(1)).to.equal(user2.address);
    });

    it("Should allow approval and transfer", async function () {
      await nftBadge.connect(user1).approve(user2.address, 1);
      await nftBadge.connect(user2).transferFrom(user1.address, addrs[0].address, 1);
      expect(await nftBadge.ownerOf(1)).to.equal(addrs[0].address);
    });

    it("Should allow setApprovalForAll", async function () {
      await nftBadge.connect(user1).setApprovalForAll(user2.address, true);
      await nftBadge.connect(user2).transferFrom(user1.address, addrs[0].address, 1);
      expect(await nftBadge.ownerOf(1)).to.equal(addrs[0].address);
    });

    it("Should return correct getApproved", async function () {
      await nftBadge.connect(user1).approve(user2.address, 1);
      expect(await nftBadge.getApproved(1)).to.equal(user2.address);
    });

    it("Should return correct isApprovedForAll", async function () {
      expect(await nftBadge.isApprovedForAll(user1.address, user2.address)).to.be.false;
      await nftBadge.connect(user1).setApprovalForAll(user2.address, true);
      expect(await nftBadge.isApprovedForAll(user1.address, user2.address)).to.be.true;
    });
  });

  describe("Transfer Restrictions", function () {
    beforeEach(async function () {
      await nftBadge.connect(owner).mint(user1.address);
    });

    it("Should fail transfer if not owner or approved", async function () {
      await expect(nftBadge.connect(user2).transferFrom(user1.address, user2.address, 1))
        .to.be.reverted;
    });

    it("Should fail transfer from zero address", async function () {
      await expect(nftBadge.connect(user1).transferFrom(ethers.ZeroAddress, user2.address, 1))
        .to.be.reverted;
    });

    it("Should fail transfer to zero address", async function () {
      await expect(nftBadge.connect(user1).transferFrom(user1.address, ethers.ZeroAddress, 1))
        .to.be.reverted;
    });

    it("Should fail transfer of non-existent token", async function () {
      await expect(nftBadge.connect(user1).transferFrom(user1.address, user2.address, 999))
        .to.be.reverted;
    });

    it("Should fail approval if not owner", async function () {
      await expect(nftBadge.connect(user2).approve(user2.address, 1))
        .to.be.reverted;
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await nftBadge.connect(owner).transferOwnership(user1.address);
      expect(await nftBadge.owner()).to.equal(user1.address);
    });

    it("Should fail if non-owner tries to transfer ownership", async function () {
      await expect(nftBadge.connect(user1).transferOwnership(user2.address))
        .to.be.revertedWithCustomError(nftBadge, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should fail to transfer ownership to zero address", async function () {
      await expect(nftBadge.connect(owner).transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(nftBadge, "OwnableInvalidOwner")
        .withArgs(ethers.ZeroAddress);
    });

    it("Should emit OwnershipTransferred event", async function () {
      await expect(nftBadge.connect(owner).transferOwnership(user1.address))
        .to.emit(nftBadge, "OwnershipTransferred")
        .withArgs(owner.address, user1.address);
    });

    it("Should allow new owner to mint after ownership transfer", async function () {
      await nftBadge.connect(owner).transferOwnership(user1.address);
      await expect(nftBadge.connect(user1).mint(user2.address))
        .to.emit(nftBadge, "Transfer")
        .withArgs(ethers.ZeroAddress, user2.address, 1);
    });
  });

  describe("Total Minted", function () {
    it("Should return zero initially", async function () {
      expect(await nftBadge.totalMinted()).to.equal(0);
    });

    it("Should increment with each mint", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      expect(await nftBadge.totalMinted()).to.equal(1);

      await nftBadge.connect(owner).mint(user2.address);
      expect(await nftBadge.totalMinted()).to.equal(2);

      await nftBadge.connect(owner).mint(addrs[0].address);
      expect(await nftBadge.totalMinted()).to.equal(3);
    });

    it("Should not change when tokens are transferred", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      const totalBefore = await nftBadge.totalMinted();
      
      await nftBadge.connect(user1).transferFrom(user1.address, user2.address, 1);
      const totalAfter = await nftBadge.totalMinted();
      
      expect(totalAfter).to.equal(totalBefore);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple mints to same address", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(owner).mint(user1.address);

      expect(await nftBadge.balanceOf(user1.address)).to.equal(3);
      expect(await nftBadge.ownerOf(1)).to.equal(user1.address);
      expect(await nftBadge.ownerOf(2)).to.equal(user1.address);
      expect(await nftBadge.ownerOf(3)).to.equal(user1.address);
    });

    it("Should handle large token IDs", async function () {
      // Mint multiple tokens to test large token IDs
      for (let i = 0; i < 10; i++) {
        await nftBadge.connect(owner).mint(addrs[i].address);
      }

      expect(await nftBadge.totalMinted()).to.equal(10);
      expect(await nftBadge.ownerOf(10)).to.equal(addrs[9].address);
    });

    it("Should handle approval revocation", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(user1).approve(user2.address, 1);
      expect(await nftBadge.getApproved(1)).to.equal(user2.address);

      await nftBadge.connect(user1).approve(ethers.ZeroAddress, 1);
      expect(await nftBadge.getApproved(1)).to.equal(ethers.ZeroAddress);
    });

    it("Should handle setApprovalForAll revocation", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(user1).setApprovalForAll(user2.address, true);
      expect(await nftBadge.isApprovedForAll(user1.address, user2.address)).to.be.true;

      await nftBadge.connect(user1).setApprovalForAll(user2.address, false);
      expect(await nftBadge.isApprovedForAll(user1.address, user2.address)).to.be.false;
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for minting", async function () {
      const tx = await nftBadge.connect(owner).mint(user1.address);
      const receipt = await tx.wait();
      
      // Gas should be reasonable for a simple mint operation
      expect(receipt.gasUsed).to.be.lt(200000);
    });

    it("Should use reasonable gas for transfer", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      const tx = await nftBadge.connect(user1).transferFrom(user1.address, user2.address, 1);
      const receipt = await tx.wait();
      
      // Gas should be reasonable for a simple transfer
      expect(receipt.gasUsed).to.be.lt(100000);
    });
  });

  describe("Integration Tests", function () {
    it("Should work with external contracts", async function () {
      // Test that the contract can be used by other contracts
      await nftBadge.connect(owner).mint(user1.address);
      
      // Simulate external contract interaction
      await nftBadge.connect(user1).approve(nftBadge.getAddress(), 1);
      
      // This should work without reverting
      expect(await nftBadge.getApproved(1)).to.equal(await nftBadge.getAddress());
    });

    it("Should maintain state consistency", async function () {
      await nftBadge.connect(owner).mint(user1.address);
      await nftBadge.connect(owner).mint(user2.address);

      // Transfer token 1
      await nftBadge.connect(user1).transferFrom(user1.address, user2.address, 1);

      // Verify state consistency
      expect(await nftBadge.ownerOf(1)).to.equal(user2.address);
      expect(await nftBadge.ownerOf(2)).to.equal(user2.address);
      expect(await nftBadge.balanceOf(user1.address)).to.equal(0);
      expect(await nftBadge.balanceOf(user2.address)).to.equal(2);
      expect(await nftBadge.totalMinted()).to.equal(2);
    });
  });
}); 