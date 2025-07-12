const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FanClubs", function () {
  let fanClubs;
  let testERC20;
  let testERC721;
  let owner;
  let user1;
  let user2;
  let user3;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();

    const FanClubs = await ethers.getContractFactory("FanClubs");
    fanClubs = await FanClubs.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await fanClubs.getAddress()).to.be.properAddress;
    });
  });

  describe("Fan Club Creation", function () {
    it("Should fail to create fan club with zero price", async function () {
      const fanClubId = "spfc";
      const price = 0;
      await expect(fanClubs.connect(user1).createFanClub(fanClubId, price))
        .to.be.revertedWith("Price must be greater than zero");
    });
    it("Should fail to create fan club that already exists", async function () {
      const fanClubId = "spfc";
      const price = ethers.parseEther("0.1");
      await fanClubs.connect(user1).createFanClub(fanClubId, price);
      await expect(fanClubs.connect(user2).createFanClub(fanClubId, price))
        .to.be.revertedWith("Fan club already exists");
    });
    it("Should add creator as first member", async function () {
      const fanClubId = "spfc";
      const price = ethers.parseEther("0.1");
      await fanClubs.connect(user1).createFanClub(fanClubId, price);
      const members = await fanClubs.getMembers(fanClubId);
      expect(members).to.include(user1.address);
      expect(await fanClubs.checkMember(fanClubId, user1.address)).to.be.true;
    });
  });

  describe("Joining Fan Clubs", function () {
    beforeEach(async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.1"));
    });
  
    it("Should fail to join with incorrect payment amount", async function () {
      const fanClubId = "spfc";
      const wrongPrice = ethers.parseEther("0.05");
      await expect(fanClubs.connect(user2).join(fanClubId, { value: wrongPrice }))
        .to.be.revertedWith("Incorrect payment");
    });
    it("Should fail to join non-existent fan club", async function () {
      const fanClubId = "nonexistent";
      const price = ethers.parseEther("0.1");
      await expect(fanClubs.connect(user2).join(fanClubId, { value: price }))
        .to.be.revertedWith("Fan club does not exist");
    });
    it("Should fail to join if already a member", async function () {
      const fanClubId = "spfc";
      const price = ethers.parseEther("0.1");
      await fanClubs.connect(user2).join(fanClubId, { value: price });
      await expect(fanClubs.connect(user2).join(fanClubId, { value: price }))
        .to.be.revertedWith("Already a member");
    });
    
  });

  describe("Leaving Fan Clubs", function () {
    beforeEach(async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.1"));
      await fanClubs.connect(user2).join("spfc", { value: ethers.parseEther("0.1") });
    });
    it("Should fail to leave if not a member", async function () {
      const fanClubId = "spfc";
      await expect(fanClubs.connect(user3).leave(fanClubId))
        .to.be.revertedWith("Not a member");
    });
    it("Should fail to leave non-existent fan club", async function () {
      const fanClubId = "nonexistent";
      await expect(fanClubs.connect(user2).leave(fanClubId))
        .to.be.revertedWith("Fan club does not exist");
    });
    it("Should remove member from members array correctly", async function () {
      const fanClubId = "spfc";
      await fanClubs.connect(user3).join(fanClubId, { value: ethers.parseEther("0.1") });
      await fanClubs.connect(user2).leave(fanClubId);
      const members = await fanClubs.getMembers(fanClubId);
      expect(members).to.not.include(user2.address);
      expect(members).to.include(user1.address);
      expect(members).to.include(user3.address);
    });
  });

  describe("Price Management", function () {
    beforeEach(async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.1"));
    });
    it("Should fail to update price if not owner", async function () {
      const fanClubId = "spfc";
      const newPrice = ethers.parseEther("0.2");
      await expect(fanClubs.connect(user2).updatePrice(fanClubId, newPrice))
        .to.be.revertedWith("Only fan club owner");
    });
    it("Should fail to update price to zero", async function () {
      const fanClubId = "spfc";
      const newPrice = 0;
      await expect(fanClubs.connect(user1).updatePrice(fanClubId, newPrice))
        .to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.1"));
      await fanClubs.connect(user2).join("spfc", { value: ethers.parseEther("0.1") });
    });

    it("Should return correct members list", async function () {
      const fanClubId = "spfc";
      const members = await fanClubs.getMembers(fanClubId);
      
      expect(members).to.include(user1.address);
      expect(members).to.include(user2.address);
      expect(members.length).to.equal(2);
    });

    it("Should return correct member status", async function () {
      const fanClubId = "spfc";
      
      expect(await fanClubs.checkMember(fanClubId, user1.address)).to.be.true;
      expect(await fanClubs.checkMember(fanClubId, user2.address)).to.be.true;
      expect(await fanClubs.checkMember(fanClubId, user3.address)).to.be.false;
    });

    it("Should return correct join price", async function () {
      const fanClubId = "spfc";
      const expectedPrice = ethers.parseEther("0.1");
      
      expect(await fanClubs.getJoinPrice(fanClubId)).to.equal(expectedPrice);
    });

    it("Should return correct owner", async function () {
      const fanClubId = "spfc";
      
      expect(await fanClubs.getOwner(fanClubId)).to.equal(user1.address);
    });

    it("Should fail to get balance if not owner", async function () {
      const fanClubId = "spfc";
      
      await expect(fanClubs.connect(user2).getBalance(fanClubId))
        .to.be.revertedWith("Only fan club owner");
    });

    it("Should fail view functions for non-existent fan club", async function () {
      const fanClubId = "nonexistent";
      
      await expect(fanClubs.getMembers(fanClubId))
        .to.be.revertedWith("Fan club does not exist");
      
      await expect(fanClubs.checkMember(fanClubId, user1.address))
        .to.be.revertedWith("Fan club does not exist");
      
      await expect(fanClubs.getJoinPrice(fanClubId))
        .to.be.revertedWith("Fan club does not exist");
      
      await expect(fanClubs.getOwner(fanClubId))
        .to.be.revertedWith("Fan club does not exist");
      
      await expect(fanClubs.getBalance(fanClubId))
        .to.be.revertedWith("Fan club does not exist");
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should handle multiple fan clubs correctly", async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.1"));
      await fanClubs.connect(user2).createFanClub("santos", ethers.parseEther("0.2"));

      expect(await fanClubs.getOwner("spfc")).to.equal(user1.address);
      expect(await fanClubs.getOwner("santos")).to.equal(user2.address);
      expect(await fanClubs.getJoinPrice("spfc")).to.equal(ethers.parseEther("0.1"));
      expect(await fanClubs.getJoinPrice("santos")).to.equal(ethers.parseEther("0.2"));
    });

    it("Should handle large member lists", async function () {
      await fanClubs.connect(user1).createFanClub("spfc", ethers.parseEther("0.01"));
      
      for (let i = 0; i < 5; i++) {
        await fanClubs.connect(addrs[i]).join("spfc", { value: ethers.parseEther("0.01") });
      }

      const members = await fanClubs.getMembers("spfc");
      expect(members.length).to.equal(6); // 5 + owner
    });
  });
});