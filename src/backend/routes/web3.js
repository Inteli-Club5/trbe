// routes/web3.js
const express = require('express');
const router = express.Router();

// Imports (ajuste conforme necessário)
const { fanClubsContract, scoreUserContract, erc20Abi } = require('../utils/contracts');
const { ethers } = require('ethers');

// --- Reputação ---
router.post('/reputation', async (req, res) => {
    const { user, likes, comments, retweets, hashtag, checkEvents, gamesId, reports } = req.body;
  
    if (
      !user ||
      likes === undefined ||
      comments === undefined ||
      retweets === undefined ||
      hashtag === undefined ||
      checkEvents === undefined ||
      gamesId === undefined ||
      reports === undefined
    ) {
      return res.status(400).json({ error: 'All parameters are required.' });
    }
  
    if (!isValidAddress(user)) {
      return res.status(400).json({ error: 'Invalid user address.' });
    }
  
    try {
      const tx = await scoreUserContract.calculateReputation(
        user,
        likes,
        comments,
        retweets,
        hashtag,
        checkEvents,
        gamesId,
        reports
      );
  
      await tx.wait();
  
      res.status(200).json({ message: 'Reputation calculated successfully!', transactionHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: 'Error calculating reputation on contract.', details: error.message });
    }
  });

router.get('/getReputation/:userAddress', async (req, res) => {
    const userAddress = req.params.userAddress;
  
    if (!isValidAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid user address.' });
    }
  
    try {
      const reputation = await scoreUserContract.getReputation(userAddress);
      res.status(200).json({ user: userAddress, reputation: reputation.toString() });
    } catch (error) {
      res.status(500).json({ error: 'Error getting reputation from contract.', details: error.message });
    }
  });

// --- FanClubs (leitura e controle) ---
router.get('/fanclubs', async (req, res) => {
    try {
      const fanClubIds = await fanClubsContract.getAllFanClubIds();
      res.json({ fanClubIds });
    } catch (error) {
      console.error('Failed to fetch fan club IDs:', error);
      res.status(500).json({ error: 'Failed to fetch fan club IDs' });
    }
  });

router.post('/fanclub/create', async (req, res) => {
  try {
    const { fanClubId, price } = req.body;

    if (!fanClubId || price === undefined) {
      return res.status(400).json({ error: 'fanClubId and price are required' });
    }

    const priceBigInt = ethers.parseUnits(price.toString(), 'ether');

    const tx = await fanClubsContract.createFanClub(fanClubId, priceBigInt);
    await tx.wait();

    res.json({ message: 'Fan club created', txHash: tx.hash });
  } catch (error) {
    console.error('[CREATE FANCLUB ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/fanclub/:fanClubId/price', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const price = await fanClubsContract.getJoinPrice(fanClubId);
      res.json({ price: price.toString() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/fanclub/:fanClubId/balance', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const balance = await fanClubsContract.getBalance(fanClubId);
      res.json({ balance: balance.toString() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/fanclub/:fanClubId/owner', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const owner = await fanClubsContract.getOwner(fanClubId);
      res.json({ owner });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/fanclub/:fanClubId/members', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const members = await fanClubsContract.getMembers(fanClubId);
      res.json({ members });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/fanclub/:fanClubId/checkMember/:user', async (req, res) => {
    try {
      const { fanClubId, user } = req.params;
      const isMember = await fanClubsContract.checkMember(fanClubId, user);
      res.json({ isMember });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// --- FanClub Membership ---
router.post('/fanclub/:fanClubId/join', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const price = await fanClubsContract.getJoinPrice(fanClubId);
      const tx = await fanClubsContract.join(fanClubId, { value: price });
      await tx.wait();
      res.json({ message: 'Joined fan club', txHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/fanclub/:fanClubId/leave', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const tx = await fanClubsContract.leave(fanClubId);
      await tx.wait();
      res.json({ message: 'Left fan club', txHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/fanclub/:fanClubId/updatePrice', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { newPrice } = req.body;
    if (newPrice === undefined) return res.status(400).json({ error: 'newPrice is required' });

    const tx = await fanClubsContract.updatePrice(fanClubId, ethers.parseUnits(newPrice.toString(), 'wei'));
    await tx.wait();

    res.json({ message: 'Price updated', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fanclub/:fanClubId/withdraw', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required' });

    const amountWei = ethers.BigNumber.from(amount.toString());
    const tx = await fanClubsContract.withdraw(fanClubId, amountWei);
    await tx.wait();

    res.json({ message: 'Withdraw successful', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- FanTokens ---
router.post('/fanclub/:fanClubId/depositFanTokens', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, amount } = req.body;

    if (!tokenAddress || !amount) {
      return res.status(400).json({ error: 'tokenAddress and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

    const approveTx = await tokenContract.approve(CONTRACT_ADDRESS_FAN_CLUBS, amountParsed);
    await approveTx.wait();

    const tx = await fanClubsContract.depositFanTokens(fanClubId, tokenAddress, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan tokens deposited successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

router.post('/fanclub/:fanClubId/withdrawFanTokens', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, amount } = req.body;

    if (!tokenAddress || !amount) {
      return res.status(400).json({ error: 'tokenAddress and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tx = await fanClubsContract.withdrawFanTokens(fanClubId, tokenAddress, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan tokens withdrawn successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

router.post('/fanclub/:fanClubId/rewardFanToken', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, recipient, amount } = req.body;

    if (!tokenAddress || !recipient || !amount) {
      return res.status(400).json({ error: 'tokenAddress, recipient, and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tx = await fanClubsContract.rewardFanToken(fanClubId, tokenAddress, recipient, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan token rewarded successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

router.get('/fanclub/:fanClubId/fanTokenBalance/:tokenAddress', async (req, res) => {
  try {
    const { fanClubId, tokenAddress } = req.params;

    const balance = await fanClubsContract.getFanTokenBalance(fanClubId, tokenAddress);
    const decimals = 18; 

    const balanceFormatted = ethers.formatUnits(balance, decimals);

    res.json({ balance: balanceFormatted.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

// --- FanNFTs ---
router.post('/fanclub/:fanClubId/depositFanNFT', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const { nftAddress, tokenId } = req.body;
  
      if (!nftAddress || tokenId === undefined)
        return res.status(400).json({ error: 'nftAddress and tokenId are required' });
  
      const tx = await fanClubsContract.depositFanNFT(fanClubId, nftAddress, tokenId);
      await tx.wait();
  
      res.json({ message: 'NFT deposited successfully', txHash: tx.hash });
    } catch (error) {
      console.error('[DEPOSIT FAN NFT ERROR]', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/fanclub/:fanClubId/withdrawFanNFT', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const { nftAddress, tokenId } = req.body;
  
      if (!nftAddress || tokenId === undefined)
        return res.status(400).json({ error: 'nftAddress and tokenId are required' });
  
      const tx = await fanClubsContract.withdrawFanNFT(fanClubId, nftAddress, tokenId);
      await tx.wait();
  
      res.json({ message: 'NFT withdrawn successfully', txHash: tx.hash });
    } catch (error) {
      console.error('[WITHDRAW FAN NFT ERROR]', error);
      res.status(500).json({ error: error.message });
    }
  });

router.post('/fanclub/:fanClubId/rewardFanNFT', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { nftAddress, recipient, tokenId } = req.body;

    if (!nftAddress || !recipient || tokenId === undefined)
      return res.status(400).json({ error: 'nftAddress, recipient, and tokenId are required' });

    const tx = await fanClubsContract.rewardFanNFT(fanClubId, nftAddress, recipient, tokenId);
    await tx.wait();

    res.json({ message: 'NFT rewarded successfully', txHash: tx.hash });
  } catch (error) {
    console.error('[REWARD FAN NFT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/fanclub/:fanClubId/getFanNFT', async (req, res) => {
    try {
      const { fanClubId } = req.params;
      const { nftAddress, tokenId } = req.query;
  
      if (!nftAddress || tokenId === undefined)
        return res.status(400).json({ error: 'nftAddress and tokenId are required' });
  
      const result = await fanClubsContract.getFanNFT(fanClubId, nftAddress, tokenId);
      res.json({ ownedByFanClub: result });
    } catch (error) {
      console.error('[GET FAN NFT ERROR]', error);
      res.status(500).json({ error: error.message });
    }
  });

// --- NFT Badges ---
router.post('/deploy/nftBadge', async (req, res) => {
  try {
    const { name, symbol, baseURI } = req.body;

    if (!name || !symbol || !baseURI) {
      return res.status(400).json({ error: 'name, symbol and baseURI are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');

    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi, bytecode } = artifact;

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const contract = await factory.deploy(name, symbol, baseURI);
    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();

    res.status(200).json({
      message: 'NFTBadge deployed successfully',
      contractAddress: deployedAddress,
      name,
      symbol,
      baseURI
    });
  } catch (error) {
    console.error('[DEPLOY NFTBADGE ERROR]', error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

router.post('/mint/nftBadge', async (req, res) => {
  try {
    const { contractAddress, to } = req.body;

    if (!contractAddress || !to) {
      return res.status(400).json({ error: 'contractAddress and to are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi } = artifact;

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.mint(to);
    const receipt = await tx.wait();
    const tokenId = BigInt(receipt.logs[0].topics[3]).toString();

    res.json({
      transactionHash: tx.hash,
      tokenId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/approve/nftBadge', async (req, res) => {
  try {
    const { contractAddress, approvedAddress, tokenId } = req.body;

    if (!contractAddress || !approvedAddress || !tokenId) {
      return res.status(400).json({ error: 'contractAddress, approvedAddress and tokenId are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi } = artifact;

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const owner = await contract.ownerOf(tokenId);
    console.log('Owner of token:', owner);
    console.log('Wallet address:', wallet.address);

    const tx = await contract.approve(approvedAddress, tokenId);
    const receipt = await tx.wait();

    res.json({
      message: 'NFT approved successfully',
      transactionHash: tx.hash,
      receipt,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// --- Marketplace ---
router.post('/marketplace/create', async (req, res) => {
  try {
    const {fanClubId, tokenAddress} = req.body;

    const tx = await fanClubsContract.createMarketplace(fanClubId, tokenAddress);
    await tx.wait();

    res.json({ message: 'Marketplace created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create marketplace' });
  }
});

router.post('/marketplace/list', async (req, res) => {
  try {
    const { fanClubId, nftAddress, tokenId, price} = req.body;

    const parsedPrice = ethers.utils.parseUnits(price.toString(), 18)

    const tx = await fanClubsContract.listItem(fanClubId, nftAddress, tokenId, parsedPrice);
    await tx.wait();

    res.json({ message: 'NFT listed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list NFT' });
  }
});

router.post('/marketplace/delist', async (req, res) => {
    try {
      const { fanClubId, nftAddress, tokenId} = req.body;
  
      const tx = await fanClubsContract.delistItem(fanClubId, nftAddress, tokenId);
      await tx.wait();
  
      res.json({ message: 'NFT delisted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delist NFT' });
    }
  });

router.post('/marketplace/buy', async (req, res) => {
  try {
    const { fanClubId, tokenAddress, nftAddress, tokenId} = req.body;

    const erc20 = new ethers.Contract(tokenAddress, erc20Abi, wallet);
    await erc20.approve(tokenAddress, price);

    const tx = await fanClubsContract.buy(fanClubId, nftAddress, tokenId);
    await tx.wait();

    res.json({ message: 'NFT purchased successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to buy NFT' });
  }
});

router.get('/marketplace/items/:fanClubId', async (req, res) => {
    try {
      const fanClubId = req.params.fanClubId;
      const items = await fanClubsContract.getItems(fanClubId);
  
      const filtered = items.filter(item => item.isListed);
  
      res.json({ items: filtered });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch marketplace items' });
    }
  });

module.exports = router;
