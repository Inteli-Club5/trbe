const { ethers } = require("hardhat");

async function main() {
    const deployer = (await ethers.getSigners())[0];

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // --- Deploy FanClubs Contract ---
    const FanClubs = await ethers.getContractFactory("FanClubs");
    const fanClubs = await FanClubs.deploy();
    await fanClubs.waitForDeployment();

    console.log("FanClubs contract deployed to:", fanClubs.target);

    // --- Deploy ScoreUser Contract ---
    const ScoreUser = await ethers.getContractFactory("ScoreUser");
    const scoreUser = await ScoreUser.deploy();
    await scoreUser.waitForDeployment();

    console.log("ScoreUser contract deployed to:", scoreUser.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });