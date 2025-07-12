const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const deployer = (await ethers.getSigners())[0];
    const network = hre.network.name;

    console.log("🚀 Starting deployment...");
    console.log("Network:", network);
    console.log("Deployer address:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    console.log("");

    // Load existing addresses
    const addressesPath = path.join(__dirname, "../contract-addresses.json");
    let addresses = {};
    
    if (fs.existsSync(addressesPath)) {
        addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    } else {
        addresses = {
            networks: {
                spicy: { FanClubs: "", ScoreUser: "" },
                hardhat: { FanClubs: "", ScoreUser: "" }
            },
            metadata: { lastDeployment: "", deployer: "", version: "1.0.0" }
        };
    }

    // --- Deploy FanClubs Contract ---
    console.log("📋 Deploying FanClubs contract...");
    const FanClubs = await ethers.getContractFactory("FanClubs");
    const fanClubs = await FanClubs.deploy();
    await fanClubs.waitForDeployment();
    const fanClubsAddress = await fanClubs.getAddress();
    console.log("✅ FanClubs deployed to:", fanClubsAddress);

    // --- Deploy ScoreUser Contract ---
    console.log("📋 Deploying ScoreUser contract...");
    const ScoreUser = await ethers.getContractFactory("ScoreUser");
    const scoreUser = await ScoreUser.deploy();
    await scoreUser.waitForDeployment();
    const scoreUserAddress = await scoreUser.getAddress();
    console.log("✅ ScoreUser deployed to:", scoreUserAddress);

    // Save addresses
    addresses.networks[network] = {
        FanClubs: fanClubsAddress,
        ScoreUser: scoreUserAddress
    };
    
    addresses.metadata.lastDeployment = new Date().toISOString();
    addresses.metadata.deployer = deployer.address;

    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log("");
    console.log("🎉 All contracts deployed successfully!");
    console.log("");
    console.log("📊 Deployment Summary:");
    console.log("├── FanClubs:", fanClubsAddress);
    console.log("└── ScoreUser:", scoreUserAddress);
    console.log("");
    console.log("📁 Contract addresses saved to: contract-addresses.json");
    console.log("");
    console.log("💡 Next steps:");
    console.log("1. Update your frontend configuration with these addresses");
    console.log("2. Verify contracts on block explorer");
    console.log("3. Test contract interactions using: npm run verify");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });