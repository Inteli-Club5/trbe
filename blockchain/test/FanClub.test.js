const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FanClub", function () {
    let FanClub;
    let fanClub;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    const initialPrice = ethers.parseEther("1");

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        FanClub = await ethers.getContractFactory("FanClub");
        fanClub = await FanClub.deploy(initialPrice, owner.address);
        await fanClub.waitForDeployment();
    });

    describe("Constructor", function () {
        it("Should set the owner correctly", async function () {
            expect(await fanClub.owner()).to.equal(owner.address);
        });

        it("Should set the joinPrice correctly", async function () {
            expect(await fanClub.joinPrice()).to.equal(initialPrice);
        });

        it("Should add the owner as an initial member", async function () {
            expect(await fanClub.checkMember(owner.address)).to.be.true;
            const members = await fanClub.getMembers();
            expect(members).to.include(owner.address);
        });

        it("Should revert if the initial price is zero", async function () {
            await expect(FanClub.deploy(0, owner.address)).to.be.revertedWith("Price must be greater than zero");
        });
    });

    describe("updatePrice", function () {
        it("Should allow the owner to update the price", async function () {
            const newPrice = ethers.parseEther("2");
            await fanClub.connect(owner).updatePrice(newPrice);
            expect(await fanClub.joinPrice()).to.equal(newPrice);
        });

        it("Should revert if a non-owner tries to update the price", async function () {
            const newPrice = ethers.parseEther("2");
            await expect(fanClub.connect(addr1).updatePrice(newPrice)).to.be.revertedWith("Only owner");
        });

        it("Should revert if the new price is zero", async function () {
            await expect(fanClub.connect(owner).updatePrice(0)).to.be.revertedWith("Price must be greater than zero");
        });
    });

    describe("join", function () {
        it("Should allow a new user to join by paying the correct price", async function () {
            await fanClub.connect(addr1).join({ value: initialPrice });
            expect(await fanClub.checkMember(addr1.address)).to.be.true;
            const members = await fanClub.getMembers();
            expect(members).to.include(addr1.address);
        });

        it("Should revert if the user is already a member", async function () {
            await fanClub.connect(addr1).join({ value: initialPrice });
            await expect(fanClub.connect(addr1).join({ value: initialPrice })).to.be.revertedWith("Already a member");
        });

        it("Should revert if the payment is incorrect", async function () {
            const incorrectPrice = ethers.parseEther("0.5");
            await expect(fanClub.connect(addr2).join({ value: incorrectPrice })).to.be.revertedWith("Incorrect payment");
        });

        it("Should increase the contract balance upon joining", async function () {
            const initialContractBalance = await ethers.provider.getBalance(fanClub.target);
            await fanClub.connect(addr1).join({ value: initialPrice });
            const finalContractBalance = await ethers.provider.getBalance(fanClub.target);
            expect(finalContractBalance).to.equal(initialContractBalance + initialPrice);
        });
    });

    describe("leave", function () {
        beforeEach(async function () {
            await fanClub.connect(addr1).join({ value: initialPrice });
            await fanClub.connect(addr2).join({ value: initialPrice });
        });

        it("Should allow a member to leave the club", async function () {
            expect(await fanClub.checkMember(addr1.address)).to.be.true;
            await fanClub.connect(addr1).leave();
            expect(await fanClub.checkMember(addr1.address)).to.be.false;
            const members = await fanClub.getMembers();
            expect(members).to.not.include(addr1.address);
            expect(members.length).to.equal(2);
        });

        it("Should revert if a non-member tries to leave", async function () {
            await expect(fanClub.connect(addrs[0]).leave()).to.be.revertedWith("Not a member");
        });

        it("Should maintain correct order of remaining members after leaving", async function () {
            let membersBeforeLeave = await fanClub.getMembers();
            expect(membersBeforeLeave.length).to.equal(3);
            expect(membersBeforeLeave[0]).to.equal(owner.address);
            expect(membersBeforeLeave[1]).to.equal(addr1.address);
            expect(membersBeforeLeave[2]).to.equal(addr2.address);

            await fanClub.connect(addr1).leave();
            let membersAfterLeave = await fanClub.getMembers();
            expect(membersAfterLeave.length).to.equal(2);
            expect(membersAfterLeave).to.include(owner.address);
            expect(membersAfterLeave).to.include(addr2.address);
            expect(membersAfterLeave).to.not.include(addr1.address);
        });
    });

    describe("getMembers", function () {
        it("Should return the correct list of members", async function () {
            const members = await fanClub.getMembers();
            expect(members).to.have.lengthOf(1);
            expect(members[0]).to.equal(owner.address);

            await fanClub.connect(addr1).join({ value: initialPrice });
            const updatedMembers = await fanClub.getMembers();
            expect(updatedMembers).to.have.lengthOf(2);
            expect(updatedMembers).to.include(owner.address);
            expect(updatedMembers).to.include(addr1.address);
        });
    });

    describe("checkMember", function () {
        it("Should return true for a member", async function () {
            expect(await fanClub.checkMember(owner.address)).to.be.true;
            await fanClub.connect(addr1).join({ value: initialPrice });
            expect(await fanClub.checkMember(addr1.address)).to.be.true;
        });

        it("Should return false for a non-member", async function () {
            expect(await fanClub.checkMember(addr2.address)).to.be.false;
        });
    });

    describe("withdraw", function () {
        it("Should allow the owner to withdraw contract funds", async function () {
            await fanClub.connect(addr1).join({ value: initialPrice });
            await fanClub.connect(addr2).join({ value: initialPrice });

            const contractBalance = await ethers.provider.getBalance(fanClub.target);
            expect(contractBalance).to.equal(initialPrice * BigInt(2));

            const ownerInitialBalance = await ethers.provider.getBalance(owner.address);

            const tx = await fanClub.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const ownerFinalBalance = await ethers.provider.getBalance(owner.address);

            expect(ownerFinalBalance).to.equal(ownerInitialBalance + contractBalance - gasUsed);
            expect(await ethers.provider.getBalance(fanClub.target)).to.equal(0);
        });

        it("Should revert if a non-owner tries to withdraw funds", async function () {
            await fanClub.connect(addr1).join({ value: initialPrice });
            await expect(fanClub.connect(addr1).withdraw()).to.be.revertedWith("Only owner");
        });

        it("Should handle withdrawal when no significant funds are present", async function () {
            expect(await ethers.provider.getBalance(fanClub.target)).to.equal(0);
            const ownerInitialBalance = await ethers.provider.getBalance(owner.address);
            const tx = await fanClub.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
            expect(ownerFinalBalance).to.be.closeTo(ownerInitialBalance - gasUsed, ethers.parseEther("0.0001"));
            expect(await ethers.provider.getBalance(fanClub.target)).to.equal(0);
        });
    });
});