const { ethers } = require("hardhat");

async function main() {
  const initialPrice = ethers.parseEther("0.1"); 
  const deployer = (await ethers.getSigners())[0];

  console.log("Deploying FanClub with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const FanClub = await ethers.getContractFactory("FanClub");
  const fanClub = await FanClub.deploy(initialPrice, deployer.address);

  await fanClub.waitForDeployment();

  console.log("FanClub deployed to:", fanClub.target);
  console.log("Initial Join Price:", ethers.formatEther(await fanClub.joinPrice()));
  console.log("Owner set to:", await fanClub.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });