const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FanClubs Contract", function () {
    let fanClubs;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        const FanClubsFactory = await ethers.getContractFactory("FanClubs");
        fanClubs = await FanClubsFactory.deploy();
        await fanClubs.waitForDeployment();
    });

    describe("createFanClub", function () {
        const clubId = "TheAwesomeFanClub";
        const price = ethers.parseEther("1");

        it("Should successfully create a fan club", async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);

            const clubOwner = await fanClubs.getOwner(clubId);
            expect(clubOwner).to.equal(owner.address);

            const clubPrice = await fanClubs.getJoinPrice(clubId);
            expect(clubPrice).to.equal(price);

            const isOwnerMember = await fanClubs.checkMember(clubId, owner.address);
            expect(isOwnerMember).to.be.true;

            const members = await fanClubs.getMembers(clubId);
            expect(members).to.deep.equal([owner.address]);
        });

        it("Should revert if fan club ID already exists", async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);
            await expect(
                fanClubs.connect(owner).createFanClub(clubId, price)
            ).to.be.revertedWith("Fan club already exists");
        });

        it("Should revert if join price is zero", async function () {
            await expect(
                fanClubs.connect(owner).createFanClub("ZeroPriceClub", 0)
            ).to.be.revertedWith("Price must be greater than zero");
        });
    });

    describe("join", function () {
        const clubId = "PopStarsElite";
        const price = ethers.parseEther("0.5");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);
        });

        it("Should allow a new user to join successfully", async function () {
            await expect(fanClubs.connect(addr1).join(clubId, { value: price }))
                .to.not.be.reverted;

            const isAddr1Member = await fanClubs.checkMember(clubId, addr1.address);
            expect(isAddr1Member).to.be.true;

            const members = await fanClubs.getMembers(clubId);
            expect(members).to.include(addr1.address);
            expect(members.length).to.equal(2);

            const clubBalance = await fanClubs.connect(owner).getBalance(clubId);
            expect(clubBalance).to.equal(price);
        });

        it("Should revert if trying to join a non-existent club", async function () {
            await expect(
                fanClubs.connect(addr1).join("NonExistentClub", { value: price })
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("Should revert if already a member", async function () {
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await expect(
                fanClubs.connect(addr1).join(clubId, { value: price })
            ).to.be.revertedWith("Already a member");
        });

        it("Should revert if incorrect payment (less)", async function () {
            await expect(
                fanClubs.connect(addr1).join(clubId, { value: ethers.parseEther("0.1") })
            ).to.be.revertedWith("Incorrect payment");
        });

        it("Should revert if incorrect payment (more)", async function () {
            await expect(
                fanClubs.connect(addr1).join(clubId, { value: ethers.parseEther("1") })
            ).to.be.revertedWith("Incorrect payment");
        });
    });

    describe("leave", function () {
        const clubId = "GamingLegends";
        const price = ethers.parseEther("0.1");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await fanClubs.connect(addr2).join(clubId, { value: price });
            await fanClubs.connect(addr3).join(clubId, { value: price });
        });

        it("Should allow a member to leave successfully", async function () {
            let membersBefore = await fanClubs.getMembers(clubId);
            expect(membersBefore).to.include(addr1.address);
            expect(membersBefore.length).to.equal(4);

            await fanClubs.connect(addr1).leave(clubId);

            const isAddr1Member = await fanClubs.checkMember(clubId, addr1.address);
            expect(isAddr1Member).to.be.false;

            const membersAfter = await fanClubs.getMembers(clubId);
            expect(membersAfter).to.not.include(addr1.address);
            expect(membersAfter.length).to.equal(3);
        });

        it("Should revert if trying to leave a non-existent club", async function () {
            await expect(
                fanClubs.connect(addr1).leave("NonExistentClub")
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("Should revert if not a member", async function () {
            await expect(
                fanClubs.connect(addrs[0]).leave(clubId)
            ).to.be.revertedWith("Not a member");
        });

        it("Should allow the owner to leave (membership status only)", async function () {
            await fanClubs.connect(owner).leave(clubId);
            const isOwnerMember = await fanClubs.checkMember(clubId, owner.address);
            expect(isOwnerMember).to.be.false;

            const currentOwner = await fanClubs.getOwner(clubId);
            expect(currentOwner).to.equal(owner.address);
        });
    });

    describe("updatePrice", function () {
        const clubId = "CodingNinjas";
        const initialPrice = ethers.parseEther("0.01");
        const newPrice = ethers.parseEther("0.02");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, initialPrice);
        });

        it("Should allow the owner to update the price successfully", async function () {
            await fanClubs.connect(owner).updatePrice(clubId, newPrice);
            const updatedPrice = await fanClubs.getJoinPrice(clubId);
            expect(updatedPrice).to.equal(newPrice);
        });

        it("Should revert if a non-owner tries to update the price", async function () {
            await expect(
                fanClubs.connect(addr1).updatePrice(clubId, newPrice)
            ).to.be.revertedWith("Only fan club owner");
        });

        it("Should revert if the new price is zero", async function () {
            await expect(
                fanClubs.connect(owner).updatePrice(clubId, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        });

        it("Should revert if updating price for a non-existent club", async function () {
            await expect(
                fanClubs.connect(owner).updatePrice("NonExistent", newPrice)
            ).to.be.revertedWith("Fan club does not exist");
        });
    });

    describe("withdraw", function () {
        const clubId = "CryptoWhales";
        const price = ethers.parseEther("0.2");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await fanClubs.connect(addr2).join(clubId, { value: price });
        });

        it("Should allow the owner to withdraw funds successfully", async function () {
            const withdrawAmount = ethers.parseEther("0.3");
            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
            
            await expect(fanClubs.connect(owner).withdraw(clubId, withdrawAmount))
                .to.not.be.reverted;

            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
            const clubBalanceAfterWithdrawal = await fanClubs.connect(owner).getBalance(clubId);

            expect(clubBalanceAfterWithdrawal).to.equal(ethers.parseEther("0.1"));
            expect(finalOwnerBalance).to.be.closeTo(initialOwnerBalance + withdrawAmount, ethers.parseEther("0.001"));
        });

        it("Should revert if a non-owner tries to withdraw", async function () {
            const withdrawAmount = ethers.parseEther("0.1");
            await expect(
                fanClubs.connect(addr1).withdraw(clubId, withdrawAmount)
            ).to.be.revertedWith("Only fan club owner");
        });

        it("Should revert if withdrawing zero amount", async function () {
            await expect(
                fanClubs.connect(owner).withdraw(clubId, 0)
            ).to.be.revertedWith("No balance to withdraw");
        });

        it("Should revert if withdrawing more than available balance", async function () {
            const currentBalance = await fanClubs.connect(owner).getBalance(clubId);
            const excessiveAmount = currentBalance + ethers.parseEther("0.1");
            await expect(
                fanClubs.connect(owner).withdraw(clubId, excessiveAmount)
            ).to.be.revertedWith("Insufficient balance");
        });

        it("Should revert if withdrawing from a non-existent club", async function () {
            await expect(
                fanClubs.connect(owner).withdraw("NonExistent", ethers.parseEther("0.1"))
            ).to.be.revertedWith("Fan club does not exist");
        });
    });

    describe("View Functions", function () {
        const clubId = "ViewTestClub";
        const price = ethers.parseEther("0.05");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await fanClubs.connect(addr2).join(clubId, { value: price });
        });

        it("getMembers should return all members", async function () {
            const members = await fanClubs.getMembers(clubId);
            expect(members).to.include(owner.address);
            expect(members).to.include(addr1.address);
            expect(members).to.include(addr2.address);
            expect(members.length).to.equal(3);
        });

        it("getMembers should revert for non-existent club", async function () {
            await expect(
                fanClubs.getMembers("NonExistent")
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("checkMember should correctly identify members and non-members", async function () {
            expect(await fanClubs.checkMember(clubId, owner.address)).to.be.true;
            expect(await fanClubs.checkMember(clubId, addr1.address)).to.be.true;
            expect(await fanClubs.checkMember(clubId, addr3.address)).to.be.false;
        });

        it("checkMember should revert for non-existent club", async function () {
            await expect(
                fanClubs.checkMember("NonExistent", owner.address)
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("getJoinPrice should return the correct price", async function () {
            const retrievedPrice = await fanClubs.getJoinPrice(clubId);
            expect(retrievedPrice).to.equal(price);
        });

        it("getJoinPrice should revert for non-existent club", async function () {
            await expect(
                fanClubs.getJoinPrice("NonExistent")
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("getOwner should return the correct owner", async function () {
            const retrievedOwner = await fanClubs.getOwner(clubId);
            expect(retrievedOwner).to.equal(owner.address);
        });

        it("getOwner should revert for non-existent club", async function () {
            await expect(
                fanClubs.getOwner("NonExistent")
            ).to.be.revertedWith("Fan club does not exist");
        });

        it("getBalance should return the correct balance for owner", async function () {
            const expectedBalance = price * BigInt(2);
            const retrievedBalance = await fanClubs.connect(owner).getBalance(clubId);
            expect(retrievedBalance).to.equal(expectedBalance);
        });

        it("getBalance should revert for non-owner", async function () {
            await expect(
                fanClubs.connect(addr1).getBalance(clubId)
            ).to.be.revertedWith("Only fan club owner");
        });

        it("getBalance should revert for non-existent club", async function () {
            await expect(
                fanClubs.connect(owner).getBalance("NonExistent")
            ).to.be.revertedWith("Fan club does not exist");
        });
    });
});