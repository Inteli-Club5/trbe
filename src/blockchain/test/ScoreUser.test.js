const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScoreUser Contract", function () {
    let scoreUser;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        const ScoreUserFactory = await ethers.getContractFactory("ScoreUser");
        scoreUser = await ScoreUserFactory.deploy();
        await scoreUser.waitForDeployment();
    });

    describe("Constructor", function () {
        it("Should set the deployer as the owner", async function () {
            expect(await scoreUser.owner()).to.equal(owner.address);
        });
    });

    describe("getReputation", function () {
        it("Should return 0 for a user with no calculated reputation", async function () {
            expect(await scoreUser.getReputation(user1.address)).to.equal(0);
        });

        it("Should return the correct reputation after calculation", async function () {
            const likes = 10;
            const comments = 5; // 5 * 2 = 10
            const retweets = 3;
            const hashtag = 2; // 2 * 3 = 6
            const checkEvents = 1; // 1 * 3 = 3
            const gamesId = 0; // 0 * 3 = 0
            const reports = 0; // 0 * 10 = 0
            const expectedScore = likes + (comments * 2) + retweets + (hashtag * 3) + (checkEvents * 3) + (gamesId * 3) - (reports * 10); // 10 + 10 + 3 + 6 + 3 + 0 - 0 = 32

            await scoreUser.connect(owner).calculateReputation(
                user1.address,
                likes,
                comments,
                retweets,
                hashtag,
                checkEvents,
                gamesId,
                reports
            );

            expect(await scoreUser.getReputation(user1.address)).to.equal(expectedScore);
        });

        it("Should return negative reputation correctly", async function () {
            const likes = 0;
            const comments = 0;
            const retweets = 0;
            const hashtag = 0;
            const checkEvents = 0;
            const gamesId = 0;
            const reports = 5; // 5 * 10 = 50
            const expectedScore = -50;

            await scoreUser.connect(owner).calculateReputation(
                user1.address,
                likes,
                comments,
                retweets,
                hashtag,
                checkEvents,
                gamesId,
                reports
            );

            expect(await scoreUser.getReputation(user1.address)).to.equal(expectedScore);
        });
    });

    describe("calculateReputation", function () {
        it("Should allow the owner to calculate reputation", async function () {
            const initialReputation = await scoreUser.getReputation(user1.address);
            expect(initialReputation).to.equal(0);

            await expect(
                scoreUser.connect(owner).calculateReputation(user1.address, 1, 2, 3, 4, 5, 6, 0)
            ).to.not.be.reverted;

            const newReputation = await scoreUser.getReputation(user1.address);
            // 1 + (2*2) + 3 + (4*3) + (5*3) + (6*3) - (0*10) = 1 + 4 + 3 + 12 + 15 + 18 = 53
            expect(newReputation).to.equal(53);
        });

        it("Should update reputation if calculated again for the same user", async function () {
            await scoreUser.connect(owner).calculateReputation(user1.address, 10, 0, 0, 0, 0, 0, 0);
            expect(await scoreUser.getReputation(user1.address)).to.equal(10);

            await scoreUser.connect(owner).calculateReputation(user1.address, 0, 0, 0, 0, 0, 0, 5);
            expect(await scoreUser.getReputation(user1.address)).to.equal(-50); // -50 from 5 reports
        });

        it("Should revert if a non-owner tries to calculate reputation", async function () {
            await expect(
                scoreUser.connect(user1).calculateReputation(user2.address, 1, 1, 1, 1, 1, 1, 1)
            ).to.be.revertedWith("Not authorized");
        });
    });
});