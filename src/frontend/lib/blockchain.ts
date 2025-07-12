import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, FAN_CLUBS_ABI, SCORE_USER_ABI } from "./contracts";
import { type FanClub, type FanClubId, type UserAddress, type ReputationData } from "./contracts";
import { NETWORK_CONSTANTS } from "./constants";

// Environment variables with fallbacks
const RPC_URL = process.env.NEXT_PUBLIC_CHILIZ_RPC_URL || "https://spicy-rpc.chiliz.com";
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "88882");
const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME || "Chiliz Spicy Testnet";
const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "CHZ";

// Contract addresses from environment or fallback
const FAN_CLUBS_CONTRACT = process.env.NEXT_PUBLIC_FAN_CLUBS_CONTRACT || "0xAa3100b296C4ad07232E4209468409A66213eFd2";
const SCORE_USER_CONTRACT = process.env.NEXT_PUBLIC_SCORE_USER_CONTRACT || "0x885D150e37ad7f3C9D622f00ecC8EBbBb6357a6E";

// Fallback RPC providers for better reliability
const FALLBACK_RPC_URLS = [
  RPC_URL,
  "https://spicy-rpc.chiliz.com",
  "https://spicy-rpc.chiliz.com/",
  "https://rpc.chiliz.com",
];

// Get a reliable provider
function getReliableProvider(): ethers.providers.JsonRpcProvider {
  for (const rpcUrl of FALLBACK_RPC_URLS) {
    try {
      return new ethers.providers.JsonRpcProvider(rpcUrl);
    } catch (error) {
      console.warn(`Failed to connect to ${rpcUrl}:`, error);
      continue;
    }
  }
  // Fallback to main RPC
  return new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
}

// Get contract instances
export function getFanClubsContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(
    FAN_CLUBS_CONTRACT,
    FAN_CLUBS_ABI,
    signerOrProvider
  );
}

export function getScoreUserContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(
    SCORE_USER_CONTRACT,
    SCORE_USER_ABI,
    signerOrProvider
  );
}

// Fan Club functions
export async function getAllFanClubIds(): Promise<string[]> {
  try {
    const provider = getReliableProvider();
    const contract = getFanClubsContract(provider);
    
    const fanClubIds = await contract.getAllFanClubIds();
    return fanClubIds;
  } catch (error) {
    console.error("Error getting all fan club IDs:", error);
    return [];
  }
}

export async function getFanClubData(
  fanClubId: FanClubId,
  userAddress?: UserAddress
): Promise<FanClub | null> {
  try {
    const provider = getReliableProvider();
    const contract = getFanClubsContract(provider);
    
    const [owner, joinPrice, members, balance, isMember] = await Promise.all([
      contract.getOwner(fanClubId),
      contract.getJoinPrice(fanClubId),
      contract.getMembers(fanClubId),
      contract.getBalance(fanClubId),
      userAddress ? contract.checkMember(fanClubId, userAddress) : false,
    ]);

    return {
      id: fanClubId,
      owner,
      joinPrice: ethers.utils.formatEther(joinPrice),
      members,
      balance: ethers.utils.formatEther(balance),
      isMember,
    };
  } catch (error) {
    console.error("Error getting fan club data:", error);
    return null;
  }
}

export async function createFanClub(
  fanClubId: FanClubId,
  price: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const priceWei = ethers.utils.parseEther(price);
    
    const tx = await contract.createFanClub(fanClubId, priceWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function joinFanClub(
  fanClubId: FanClubId,
  price: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const priceWei = ethers.utils.parseEther(price);
    
    const tx = await contract.join(fanClubId, { value: priceWei });
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function leaveFanClub(
  fanClubId: FanClubId,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const tx = await contract.leave(fanClubId);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function updateFanClubPrice(
  fanClubId: FanClubId,
  newPrice: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const priceWei = ethers.utils.parseEther(newPrice);
    
    const tx = await contract.updatePrice(fanClubId, priceWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function withdrawFromFanClub(
  fanClubId: FanClubId,
  amount: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const amountWei = ethers.utils.parseEther(amount);
    
    const tx = await contract.withdraw(fanClubId, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

// Reputation functions
export async function getUserReputation(userAddress: UserAddress): Promise<number> {
  try {
    const provider = getReliableProvider();
    const contract = getScoreUserContract(provider);
    
    const reputation = await contract.getReputation(userAddress);
    return Number(reputation);
  } catch (error) {
    console.error("Error getting user reputation:", error);
    return 0;
  }
}

export async function calculateReputation(
  userAddress: UserAddress,
  reputationData: Omit<ReputationData, "user" | "score">,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getScoreUserContract(signer);
    
    const tx = await contract.calculateReputation(
      userAddress,
      reputationData.likes,
      reputationData.comments,
      reputationData.retweets,
      reputationData.hashtags,
      reputationData.checkEvents,
      reputationData.gamesId,
      reputationData.reports
    );
    
    const receipt = await tx.wait();
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

// Network functions
export async function switchToChilizNetwork(): Promise<boolean> {
  try {
    if (!window.ethereum) {
      throw new Error("No wallet detected");
    }

    const ethereum = window.ethereum as any;
    
    // Try to switch to the network first
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: CHAIN_NAME,
                nativeCurrency: {
                  name: CURRENCY_SYMBOL,
                  symbol: CURRENCY_SYMBOL,
                  decimals: 18,
                },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: ["https://spicy-explorer.chiliz.com"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          return false;
        }
      }
      console.error("Failed to switch network:", switchError);
      return false;
    }
  } catch (error) {
    console.error("Network switch error:", error);
    return false;
  }
}

// Check if we're on the correct network
export async function checkNetwork(): Promise<{ isCorrect: boolean; chainId?: number }> {
  try {
    if (!window.ethereum) {
      return { isCorrect: false };
    }

    const ethereum = window.ethereum as any;
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const isCorrect = parseInt(chainId, 16) === CHAIN_ID;
    
    return { isCorrect, chainId: parseInt(chainId, 16) };
  } catch (error) {
    console.error("Failed to check network:", error);
    return { isCorrect: false };
  }
}

// Utility functions
export function formatEther(amount: string | number): string {
  try {
    return ethers.utils.formatEther(amount.toString());
  } catch {
    return "0";
  }
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseContractError(error: any): string {
  if (typeof error === "string") return error;
  
  if (error?.message) {
    // Handle common contract errors
    const message = error.message.toLowerCase();
    
    if (message.includes("insufficient funds")) {
      return "Insufficient funds for transaction";
    }
    if (message.includes("user rejected")) {
      return "Transaction was rejected by user";
    }
    if (message.includes("network error")) {
      return "Network connection error";
    }
    if (message.includes("already a member")) {
      return "You are already a member of this fan club";
    }
    if (message.includes("not a member")) {
      return "You are not a member of this fan club";
    }
    if (message.includes("only fan club owner")) {
      return "Only the fan club owner can perform this action";
    }
    if (message.includes("fan club does not exist")) {
      return "Fan club does not exist";
    }
    if (message.includes("fan club already exists")) {
      return "Fan club already exists";
    }
    if (message.includes("incorrect payment")) {
      return "Incorrect payment amount";
    }
    if (message.includes("price must be greater than zero")) {
      return "Price must be greater than zero";
    }
    if (message.includes("marketplace already exists")) {
      return "Marketplace already exists for this fan club";
    }
    if (message.includes("marketplace not initialized")) {
      return "Marketplace not initialized for this fan club";
    }
    if (message.includes("item not listed")) {
      return "Item is not listed in the marketplace";
    }
    if (message.includes("only members can buy")) {
      return "Only fan club members can buy items";
    }
    if (message.includes("nft not held by fan club")) {
      return "NFT is not owned by the fan club";
    }
    if (message.includes("already listed")) {
      return "Item is already listed in the marketplace";
    }
    
    return error.message;
  }
  
  return "An unknown error occurred";
}

// Marketplace functions
export async function createMarketplace(
  fanClubId: FanClubId,
  tokenAddress: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    
    const tx = await contract.createMarketplace(fanClubId, tokenAddress);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function listMarketplaceItem(
  fanClubId: FanClubId,
  nftAddress: string,
  tokenId: number,
  price: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const priceWei = ethers.utils.parseEther(price);
    
    const tx = await contract.listItem(fanClubId, nftAddress, tokenId, priceWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function delistMarketplaceItem(
  fanClubId: FanClubId,
  nftAddress: string,
  tokenId: number,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    
    const tx = await contract.delistItem(fanClubId, nftAddress, tokenId);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function buyMarketplaceItem(
  fanClubId: FanClubId,
  nftAddress: string,
  tokenId: number,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    
    const tx = await contract.buy(fanClubId, nftAddress, tokenId);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function getMarketplaceItems(
  fanClubId: FanClubId
): Promise<Array<{
  nftAddress: string;
  tokenId: number;
  price: string;
  isListed: boolean;
}>> {
  try {
    const provider = getReliableProvider();
    const contract = getFanClubsContract(provider);
    
    const items = await contract.getItems(fanClubId);
    
    return items.map((item: any) => ({
      nftAddress: item.nftAddress,
      tokenId: Number(item.tokenId),
      price: ethers.utils.formatEther(item.price),
      isListed: item.isListed,
    }));
  } catch (error) {
    console.error("Error getting marketplace items:", error);
    return [];
  }
}

export async function getFanTokenBalance(
  fanClubId: FanClubId,
  tokenAddress: string,
  signer: ethers.Signer
): Promise<string> {
  try {
    const contract = getFanClubsContract(signer);
    const balance = await contract.getFanTokenBalance(fanClubId, tokenAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error getting fan token balance:", error);
    return "0";
  }
}

export async function depositFanTokens(
  fanClubId: FanClubId,
  tokenAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const amountWei = ethers.utils.parseEther(amount);
    
    const tx = await contract.depositFanTokens(fanClubId, tokenAddress, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function withdrawFanTokens(
  fanClubId: FanClubId,
  tokenAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const amountWei = ethers.utils.parseEther(amount);
    
    const tx = await contract.withdrawFanTokens(fanClubId, tokenAddress, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
}

export async function rewardFanTokens(
  fanClubId: FanClubId,
  tokenAddress: string,
  recipient: string,
  amount: string,
  signer: ethers.Signer
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const contract = getFanClubsContract(signer);
    const amountWei = ethers.utils.parseEther(amount);
    
    const tx = await contract.rewardFanToken(fanClubId, tokenAddress, recipient, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    return { success: false, error: parseContractError(error) };
  }
} 