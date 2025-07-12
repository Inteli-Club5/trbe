/**
 * Ethereum provider interface for window.ethereum
 */
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  selectedAddress?: string;
  chainId?: string;
}

/**
 * Transaction result interface
 */
export interface TransactionResult {
  success: boolean;
  receipt?: any;
  hash: string;
  error?: any;
}

/**
 * Blockchain state interface
 */
export interface BlockchainState {
  isConnected: boolean;
  address: string | null;
  signer: any | null;
  provider: any | null;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Transaction state interface
 */
export interface TransactionState {
  isPending: boolean;
  hash: string | null;
  error: string | null;
}

/**
 * Fan club state interface
 */
export interface FanClubState {
  fanClubs: Map<string, any>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Reputation state interface
 */
export interface ReputationState {
  reputation: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Social activity interface
 */
export interface SocialActivity {
  likes?: number;
  comments?: number;
  retweets?: number;
  hashtags?: number;
  checkEvents?: number;
  gamesId?: number;
  reports?: number;
} 