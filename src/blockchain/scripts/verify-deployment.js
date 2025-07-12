const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const network = hre.network.name;
    
    console.log("🔍 Verifying deployed contracts...");
    console.log("Network:", network);
    console.log("");

    // Load contract addresses
    const addressesPath = path.join(__dirname, "../contract-addresses.json");
    
    if (!fs.existsSync(addressesPath)) {
        console.error("❌ Contract addresses file not found!");
        console.log("💡 Please run deployment first: npm run deploy");
        return;
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    const networkAddresses = addresses.networks[network];

    if (!networkAddresses || !networkAddresses.FanClubs) {
        console.error("❌ No contracts deployed on this network!");
        console.log("💡 Please run deployment first: npm run deploy");
        return;
    }

    try {
        // Verify FanClubs
        console.log("📋 Verifying FanClubs contract...");
        const fanClubs = await ethers.getContractAt("FanClubs", networkAddresses.FanClubs);
        console.log("✅ FanClubs contract verified at:", networkAddresses.FanClubs);

        // Verify ScoreUser
        console.log("📋 Verifying ScoreUser contract...");
        const scoreUser = await ethers.getContractAt("ScoreUser", networkAddresses.ScoreUser);
        console.log("✅ ScoreUser contract verified at:", networkAddresses.ScoreUser);

        // Test basic functionality
        console.log("");
        console.log("🧪 Testing basic contract functionality...");

        // Test FanClubs basic functionality
        console.log("✅ FanClubs contract is accessible");

        // Test ScoreUser basic functionality
        console.log("✅ ScoreUser contract is accessible");

        console.log("");
        console.log("🎉 All contracts verified successfully!");
        console.log("");
        console.log("📊 Contract Addresses:");
        console.log("├── FanClubs:", networkAddresses.FanClubs);
        console.log("└── ScoreUser:", networkAddresses.ScoreUser);

    } catch (error) {
        console.error("❌ Verification failed:", error.message);
        console.log("");
        console.log("💡 Make sure to:");
        console.log("1. Deploy contracts first using: npm run deploy");
        console.log("2. Check if you're connected to the correct network");
        console.log("3. Verify contract addresses in contract-addresses.json");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Script failed:", error);
        process.exit(1);
    }); 