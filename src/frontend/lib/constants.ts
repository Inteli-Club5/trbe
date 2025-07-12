// Network constants
export const NETWORK_CONSTANTS = {
  CHILIZ_SPICY_TESTNET: {
    CHAIN_ID: 88882,
    NAME: "Chiliz Spicy Testnet",
    RPC_URL: "https://spicy-rpc.chiliz.com",
    BLOCK_EXPLORER: "https://spicy-explorer.chiliz.com",
    NATIVE_CURRENCY: {
      NAME: "CHZ",
      SYMBOL: "CHZ",
      DECIMALS: 18,
    },
  },
} as const;

// Reputation scoring constants
export const REPUTATION_CONSTANTS = {
  WEIGHTS: {
    LIKES: 1,
    COMMENTS: 2,
    RETWEETS: 1,
    HASHTAGS: 3,
    CHECK_EVENTS: 3,
    GAMES_ID: 3,
    REPORTS: -10, // Negative weight
  },
  LEVELS: {
    LEGENDARY: 1000,
    ELITE: 500,
    VETERAN: 200,
    ACTIVE: 100,
    REGULAR: 50,
    NEWCOMER: 10,
    ROOKIE: 0,
  },
} as const;

// Transaction constants
export const TRANSACTION_CONSTANTS = {
  ERROR_CODES: {
    USER_REJECTED: 4001,
    NETWORK_ERROR: -32603,
  },
  TOAST_DURATION: 5000,
} as const;

// UI constants
export const UI_CONSTANTS = {
  ADDRESS_FORMAT: {
    PREFIX_LENGTH: 6,
    SUFFIX_LENGTH: 4,
  },
  LOADING_STATES: {
    DEBOUNCE_DELAY: 300,
  },
} as const;

// Contract function names
export const CONTRACT_FUNCTIONS = {
  FAN_CLUBS: {
    CREATE: "createFanClub",
    JOIN: "join",
    LEAVE: "leave",
    UPDATE_PRICE: "updatePrice",
    WITHDRAW: "withdraw",
    GET_MEMBERS: "getMembers",
    CHECK_MEMBER: "checkMember",
    GET_JOIN_PRICE: "getJoinPrice",
    GET_OWNER: "getOwner",
    GET_BALANCE: "getBalance",
  },
  SCORE_USER: {
    GET_REPUTATION: "getReputation",
    CALCULATE_REPUTATION: "calculateReputation",
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET: {
    NOT_CONNECTED: "Please connect your wallet first",
    WRONG_NETWORK: "Please switch to Chiliz Spicy Testnet",
    NETWORK_SWITCH_FAILED: "Failed to switch network",
  },
  TRANSACTION: {
    REJECTED: "Transaction rejected by user",
    NETWORK_ERROR: "Network error. Please try again.",
    UNEXPECTED: "An unexpected error occurred",
    INSUFFICIENT_FUNDS: "Insufficient funds for transaction",
  },
  FAN_CLUB: {
    NOT_FOUND: "Fan club not found",
    ALREADY_EXISTS: "Fan club already exists",
    ALREADY_MEMBER: "Already a member",
    NOT_MEMBER: "Not a member",
    NOT_OWNER: "Only fan club owner",
    INVALID_PRICE: "Price must be greater than zero",
    INCORRECT_PAYMENT: "Incorrect payment amount",
  },
  REPUTATION: {
    LOAD_FAILED: "Failed to load reputation data",
    UPDATE_FAILED: "Failed to update reputation",
    NO_ADDRESS: "No address provided",
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  NETWORK: {
    SWITCHED: "Successfully connected to Chiliz Spicy Testnet",
  },
  FAN_CLUB: {
    CREATED: (id: string) => `Fan club "${id}" created successfully!`,
    JOINED: (id: string) => `Successfully joined fan club "${id}"!`,
    LEFT: (id: string) => `Successfully left fan club "${id}"!`,
    PRICE_UPDATED: (id: string) => `Fan club "${id}" price updated successfully!`,
    WITHDREW: (amount: string, id: string) => 
      `Successfully withdrew ${amount} CHZ from fan club "${id}"!`,
  },
  REPUTATION: {
    UPDATED: "Reputation updated successfully!",
  },
  TRANSACTION: {
    SUCCESS: "Transaction successful!",
  },
} as const; 