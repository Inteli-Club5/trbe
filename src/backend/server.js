require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const ABI_FILE_PATH = path.join(__dirname, 'abis', 'FanClub.json');

let FANCLUB_ABI;

let provider;
let signer;
global.contract = null;

function initializeContract() {
    const rpcUrl = process.env.RPC_URL;
    const chainId = parseInt(process.env.CHAIN_ID, 10);
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !chainId || !contractAddress) {
        console.error('Error: RPC_URL, CHAIN_ID, and CONTRACT_ADDRESS environment variables are required.');
        process.exit(1);
    }

    try {
        const abiJson = JSON.parse(fs.readFileSync(ABI_FILE_PATH, 'utf8'));
        FANCLUB_ABI = abiJson.abi;

        provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);

        if (privateKey) {
            signer = new ethers.Wallet(privateKey, provider);
            console.log(`Signer initialized with address: ${signer.address}`);
            global.contract = new ethers.Contract(contractAddress, FANCLUB_ABI, signer);
        } else {
            console.warn('WARNING: No PRIVATE_KEY provided. Only view functions will be available.');
            global.contract = new ethers.Contract(contractAddress, FANCLUB_ABI, provider);
        }

        console.log('FanClub contract initialized at address:', contractAddress);
    } catch (error) {
        console.error('Error initializing contract:', error);
        process.exit(1);
    }
}


app.get('/join-price', async (req, res) => {
    try {
        const price = await global.contract.joinPrice();
        res.json({
            priceWei: price.toString(),
            priceEth: ethers.utils.formatEther(price)
        });
    } catch (error) {
        console.error('Error calling joinPrice:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/owner', async (req, res) => {
    try {
        const ownerAddress = await global.contract.owner();
        res.json({ owner: ownerAddress });
    } catch (error) {
        console.error('Error calling owner:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/check-member/:userAddress', async (req, res) => {
    const userAddress = req.params.userAddress;
    if (!ethers.utils.isAddress(userAddress)) {
        return res.status(400).json({ error: 'Invalid user address.' });
    }
    try {
        const isMember = await global.contract.checkMember(userAddress);
        res.json({ user: userAddress, isMember: isMember });
    } catch (error) {
        console.error('Error calling checkMember:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/members', async (req, res) => {
    try {
        const members = await global.contract.getMembers();
        res.json({ members: members });
    } catch (error) {
        console.error('Error calling getMembers:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        if (!signer || signer === provider) {
            return res.status(403).json({ error: 'Private key required to send transactions.' });
        }
    }
    next();
});

app.post('/join', async (req, res) => {
    const { amountEth } = req.body;
    if (!amountEth || isNaN(amountEth) || parseFloat(amountEth) <= 0) {
        return res.status(400).json({ error: 'Invalid ETH amount for joining.' });
    }

    try {
        const valueWei = ethers.utils.parseEther(amountEth.toString());
        const tx = await global.contract.join({ value: valueWei });
        await tx.wait();
        res.json({ message: 'Successfully joined!', transactionHash: tx.hash });
    } catch (error) {
        console.error('Error calling join:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/leave', async (req, res) => {
    try {
        const tx = await global.contract.leave();
        await tx.wait();
        res.json({ message: 'Successfully left!', transactionHash: tx.hash });
    } catch (error) {
        console.error('Error calling leave:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/update-price', async (req, res) => {
    const { newPrice } = req.body;
    if (newPrice === undefined || isNaN(newPrice) || parseInt(newPrice, 10) <= 0) {
        return res.status(400).json({ error: 'Invalid new price (must be a positive number in Wei).' });
    }

    try {
        const tx = await global.contract.updatePrice(newPrice);
        await tx.wait();
        res.json({ message: `Price updated to ${newPrice} Wei!`, transactionHash: tx.hash });
    } catch (error) {
        console.error('Error calling updatePrice:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/withdraw', async (req, res) => {
    try {
        const tx = await global.contract.withdraw();
        await tx.wait();
        res.json({ message: 'Funds withdrawn successfully!', transactionHash: tx.hash });
    } catch (error) {
        console.error('Error calling withdraw:', error);
        res.status(500).json({ error: error.message });
    }
});

function startServer() {
    initializeContract();
    app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = { app, initializeContract };