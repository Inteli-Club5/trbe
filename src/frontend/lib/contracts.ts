import { NETWORK_CONSTANTS } from "./constants";

/**
 * Contract addresses for deployed smart contracts on Chiliz Spicy Testnet
 */
export const CONTRACT_ADDRESSES = {
  FAN_CLUBS: "0x7735eD58ea943Ee6EF611F853d44eeF08d0151e7",
  SCORE_USER: "0xb3eDdd3b7fd6946F9242b90a4e750c7f9a4B6d85",
  NFT_BADGE: "", // Add when deployed
} as const;

/**
 * Network configuration for Chiliz Spicy Testnet
 */
export const NETWORK_CONFIG = {
  chainId: NETWORK_CONSTANTS.CHILIZ_SPICY_TESTNET.CHAIN_ID,
  name: NETWORK_CONSTANTS.CHILIZ_SPICY_TESTNET.NAME,
  rpcUrl: NETWORK_CONSTANTS.CHILIZ_SPICY_TESTNET.RPC_URL,
  blockExplorer: NETWORK_CONSTANTS.CHILIZ_SPICY_TESTNET.BLOCK_EXPLORER,
  nativeCurrency: NETWORK_CONSTANTS.CHILIZ_SPICY_TESTNET.NATIVE_CURRENCY,
} as const;

// FanClubs Contract ABI (minimal version for frontend)
export const FAN_CLUBS_ABI = [
  // View functions
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "getMembers",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "fanClubId", type: "string" },
      { name: "user", type: "address" },
    ],
    name: "checkMember",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "getJoinPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "getOwner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "getBalance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // State-changing functions
  {
    inputs: [
      { name: "fanClubId", type: "string" },
      { name: "_price", type: "uint256" },
    ],
    name: "createFanClub",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "join",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "fanClubId", type: "string" }],
    name: "leave",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "fanClubId", type: "string" },
      { name: "newPrice", type: "uint256" },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "fanClubId", type: "string" },
      { name: "amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ScoreUser Contract ABI
export const SCORE_USER_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getReputation",
    outputs: [{ name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "likes", type: "int256" },
      { name: "comments", type: "int256" },
      { name: "retweets", type: "int256" },
      { name: "hashtag", type: "int256" },
      { name: "checkEvents", type: "int256" },
      { name: "gamesId", type: "int256" },
      { name: "reports", type: "int256" },
    ],
    name: "calculateReputation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// NFTBadge Contract ABI (for future use)
export const NFT_BADGE_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "mint",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract types
export type FanClubId = string;
export type ContractAddress = string;
export type UserAddress = string;

// Fan Club data structure
export interface FanClub {
  id: FanClubId;
  owner: UserAddress;
  joinPrice: string;
  members: UserAddress[];
  balance: string;
  isMember: boolean;
}

// Reputation data structure
export interface ReputationData {
  user: UserAddress;
  score: number;
  likes: number;
  comments: number;
  retweets: number;
  hashtags: number;
  checkEvents: number;
  gamesId: number;
  reports: number;
} 