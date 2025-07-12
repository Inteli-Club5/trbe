const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FanClubs Contract", function () {
    let fanClubs;
    let mockToken;
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

        const MockTokenFactory = await ethers.getContractFactory("MockERC20");
        mockToken = await MockTokenFactory.deploy("Mock Token", "MTK");
        await mockToken.waitForDeployment();
    });

    describe("Constructor", function () {
        it("Should deploy successfully", async function () {
            expect(await fanClubs.getDeployedCode()).to.not.equal("0x");
        });
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

        it("Should allow different users to create different clubs", async function () {
            await fanClubs.connect(owner).createFanClub("Club1", price);
            await fanClubs.connect(addr1).createFanClub("Club2", price);
            
            expect(await fanClubs.getOwner("Club1")).to.equal(owner.address);
            expect(await fanClubs.getOwner("Club2")).to.equal(addr1.address);
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

        it("Should accumulate balance correctly with multiple joins", async function () {
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await fanClubs.connect(addr2).join(clubId, { value: price });
            
            const clubBalance = await fanClubs.connect(owner).getBalance(clubId);
            expect(clubBalance).to.equal(price * BigInt(2));
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

        it("Should maintain correct member order after leaving", async function () {
            const membersBefore = await fanClubs.getMembers(clubId);
            await fanClubs.connect(addr2).leave(clubId);
            const membersAfter = await fanClubs.getMembers(clubId);
            
            expect(membersAfter).to.not.include(addr2.address);
            expect(membersAfter.length).to.equal(membersBefore.length - 1);
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

        it("Should allow price updates multiple times", async function () {
            await fanClubs.connect(owner).updatePrice(clubId, newPrice);
            const finalPrice = ethers.parseEther("0.05");
            await fanClubs.connect(owner).updatePrice(clubId, finalPrice);
            
            const updatedPrice = await fanClubs.getJoinPrice(clubId);
            expect(updatedPrice).to.equal(finalPrice);
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

        it("Should allow multiple withdrawals", async function () {
            const firstWithdrawal = ethers.parseEther("0.1");
            const secondWithdrawal = ethers.parseEther("0.2");
            
            await fanClubs.connect(owner).withdraw(clubId, firstWithdrawal);
            await fanClubs.connect(owner).withdraw(clubId, secondWithdrawal);
            
            const finalBalance = await fanClubs.connect(owner).getBalance(clubId);
            expect(finalBalance).to.equal(ethers.parseEther("0.1"));
        });
    });

    describe("Fan Token Functions", function () {
        const clubId = "TokenClub";
        const price = ethers.parseEther("0.1");
        const tokenAmount = ethers.parseEther("100");

        beforeEach(async function () {
            await fanClubs.connect(owner).createFanClub(clubId, price);

            await mockToken.mint(owner.address, tokenAmount);
            await mockToken.mint(addr1.address, tokenAmount);
            await mockToken.mint(addr2.address, tokenAmount);
            
            await mockToken.connect(owner).approve(fanClubs.target, tokenAmount);
            await mockToken.connect(addr1).approve(fanClubs.target, tokenAmount);
            await mockToken.connect(addr2).approve(fanClubs.target, tokenAmount);
        });

        describe("depositFanTokens", function () {
            it("Should allow users to deposit tokens successfully", async function () {
                const depositAmount = ethers.parseEther("10");
                
                await fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, depositAmount);
                
                const tokenBalance = await fanClubs.connect(owner).getFanTokenBalance(clubId, mockToken.target);
                expect(tokenBalance).to.equal(depositAmount);
            });

            it("Should revert if amount is zero", async function () {
                await expect(
                    fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, 0)
                ).to.be.revertedWith("Amount must be greater than 0");
            });

            it("Should revert if token transfer fails", async function () {
                const excessiveAmount = ethers.parseEther("1000");

                await expect(
                    fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, excessiveAmount)
                ).to.be.reverted;
            });

            it("Should accumulate token balance correctly", async function () {
                const deposit1 = ethers.parseEther("10");
                const deposit2 = ethers.parseEther("20");
                
                await fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, deposit1);
                await fanClubs.connect(addr2).depositFanTokens(clubId, mockToken.target, deposit2);
                
                const totalBalance = await fanClubs.connect(owner).getFanTokenBalance(clubId, mockToken.target);
                expect(totalBalance).to.equal(deposit1 + deposit2);
            });
        });

        describe("withdrawFanTokens", function () {
            beforeEach(async function () {
                await fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, tokenAmount);
            });

            it("Should allow owner to withdraw tokens successfully", async function () {
                const withdrawAmount = ethers.parseEther("50");
                const initialOwnerBalance = await mockToken.balanceOf(owner.address);
                
                await fanClubs.connect(owner).withdrawFanTokens(clubId, mockToken.target, withdrawAmount);
                
                const finalOwnerBalance = await mockToken.balanceOf(owner.address);
                const contractBalance = await fanClubs.connect(owner).getFanTokenBalance(clubId, mockToken.target);
                
                expect(finalOwnerBalance).to.equal(initialOwnerBalance + withdrawAmount);
                expect(contractBalance).to.equal(tokenAmount - withdrawAmount);
            });

            it("Should revert if non-owner tries to withdraw", async function () {
                await expect(
                    fanClubs.connect(addr1).withdrawFanTokens(clubId, mockToken.target, ethers.parseEther("10"))
                ).to.be.revertedWith("Only fan club owner");
            });

            it("Should revert if withdrawing more than available balance", async function () {
                const excessiveAmount = tokenAmount + ethers.parseEther("1");
                await expect(
                    fanClubs.connect(owner).withdrawFanTokens(clubId, mockToken.target, excessiveAmount)
                ).to.be.reverted;
            });

            it("Should revert if club does not exist", async function () {
                await expect(
                    fanClubs.connect(owner).withdrawFanTokens("NonExistent", mockToken.target, ethers.parseEther("10"))
                ).to.be.revertedWith("Fan club does not exist");
            });
        });

        describe("rewardFanToken", function () {
            beforeEach(async function () {
                await fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, tokenAmount);
            });

            it("Should allow owner to reward tokens successfully", async function () {
                const rewardAmount = ethers.parseEther("10");
                const initialRecipientBalance = await mockToken.balanceOf(addr2.address);
                
                await fanClubs.connect(owner).rewardFanToken(clubId, mockToken.target, addr2.address, rewardAmount);
                
                const finalRecipientBalance = await mockToken.balanceOf(addr2.address);
                const contractBalance = await fanClubs.connect(owner).getFanTokenBalance(clubId, mockToken.target);
                
                expect(finalRecipientBalance).to.equal(initialRecipientBalance + rewardAmount);
                expect(contractBalance).to.equal(tokenAmount - rewardAmount);
            });

            it("Should revert if non-owner tries to reward", async function () {
                await expect(
                    fanClubs.connect(addr1).rewardFanToken(clubId, mockToken.target, addr2.address, ethers.parseEther("10"))
                ).to.be.revertedWith("Only fan club owner");
            });

            it("Should revert if amount is zero", async function () {
                await expect(
                    fanClubs.connect(owner).rewardFanToken(clubId, mockToken.target, addr2.address, 0)
                ).to.be.revertedWith("Amount must be greater than 0");
            });

            it("Should revert if insufficient token balance", async function () {
                const excessiveAmount = tokenAmount + ethers.parseEther("1");
                await expect(
                    fanClubs.connect(owner).rewardFanToken(clubId, mockToken.target, addr2.address, excessiveAmount)
                ).to.be.reverted;
            });
        });

        describe("getFanTokenBalance", function () {
            beforeEach(async function () {
                await fanClubs.connect(addr1).depositFanTokens(clubId, mockToken.target, tokenAmount);
            });

            it("Should return correct token balance for owner", async function () {
                const balance = await fanClubs.connect(owner).getFanTokenBalance(clubId, mockToken.target);
                expect(balance).to.equal(tokenAmount);
            });

            it("Should revert if non-owner tries to check balance", async function () {
                await expect(
                    fanClubs.connect(addr1).getFanTokenBalance(clubId, mockToken.target)
                ).to.be.revertedWith("Only fan club owner");
            });

            it("Should return zero for non-existent token", async function () {
                const balance = await fanClubs.connect(owner).getFanTokenBalance(clubId, addr3.address);
                expect(balance).to.equal(0);
            });
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

    describe("Edge Cases and Security", function () {
        it("Should handle empty string club IDs", async function () {
            await fanClubs.connect(owner).createFanClub("", ethers.parseEther("1"));
            expect(await fanClubs.getOwner("")).to.equal(owner.address);
        });

        it("Should handle very large prices", async function () {
            const largePrice = ethers.parseEther("1000000");
            await fanClubs.connect(owner).createFanClub("ExpensiveClub", largePrice);
            expect(await fanClubs.getJoinPrice("ExpensiveClub")).to.equal(largePrice);
        });

        it("Should handle multiple clubs with same owner", async function () {
            await fanClubs.connect(owner).createFanClub("Club1", ethers.parseEther("1"));
            await fanClubs.connect(owner).createFanClub("Club2", ethers.parseEther("2"));
            
            expect(await fanClubs.getOwner("Club1")).to.equal(owner.address);
            expect(await fanClubs.getOwner("Club2")).to.equal(owner.address);
        });

        it("Should maintain data integrity after multiple operations", async function () {
            const clubId = "IntegrityTest";
            const price = ethers.parseEther("0.1");
            
            await fanClubs.connect(owner).createFanClub(clubId, price);
            
            await fanClubs.connect(addr1).join(clubId, { value: price });
            await fanClubs.connect(addr2).join(clubId, { value: price });
            
            await fanClubs.connect(addr1).leave(clubId);
            await fanClubs.connect(addr1).join(clubId, { value: price });
            
            await fanClubs.connect(owner).updatePrice(clubId, ethers.parseEther("0.2"));
            
            expect(await fanClubs.getOwner(clubId)).to.equal(owner.address);
            expect(await fanClubs.getJoinPrice(clubId)).to.equal(ethers.parseEther("0.2"));
            expect(await fanClubs.checkMember(clubId, addr1.address)).to.be.true;
            expect(await fanClubs.checkMember(clubId, addr2.address)).to.be.true;
            
            const members = await fanClubs.getMembers(clubId);
            expect(members.length).to.equal(3);
            expect(members).to.include(owner.address);
            expect(members).to.include(addr1.address);
            expect(members).to.include(addr2.address);
        });
    });
});