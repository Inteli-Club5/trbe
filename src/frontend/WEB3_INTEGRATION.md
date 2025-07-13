# Web3 Integration Guide

This document explains how Web3 operations work in the TRBE application, separated from traditional authentication.

## Overview

The Web3 integration system provides:

1. **Traditional Authentication**: Users login with email/password (separate from Web3)
2. **Optional Wallet Connection**: Users can connect their wallet for blockchain operations
3. **Blockchain Operations**: Smart contract interactions using wallet signatures
4. **Easy-to-use Hooks**: React hooks for seamless integration
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Type Safety**: Full TypeScript support

## Architecture

### Authentication System

1. **Traditional Authentication** (`src/frontend/context/auth-context.tsx`)
   - Email/password login system
   - JWT token-based authentication
   - Completely separate from Web3 operations

2. **Web3 Operations** (`src/frontend/hooks/use-web3-operations.ts`)
   - Wallet connection management
   - Network switching (Chiliz Spicy Testnet)
   - Blockchain operation execution

### Backend Components

1. **Traditional API Routes** (`src/backend/routes/`)
   - Standard JWT authentication
   - Email/password login endpoints
   - User management

2. **Web3 API Routes** (Optional - `src/backend/routes/web3.js`)
   - Wallet signature authentication
   - Blockchain-specific operations

### Frontend Components

1. **Web3 Operations Hook** (`src/frontend/hooks/use-web3-operations.ts`)
   - Wallet connection management
   - Network verification and switching
   - Generic operation execution

2. **Blockchain Hook** (`src/frontend/hooks/use-blockchain.ts`)
   - Smart contract interactions
   - Fan clubs, reputation, marketplace operations

3. **Web3 API Client** (Optional - `src/frontend/lib/web3-api.ts`)
   - Wallet-authenticated API calls
   - Alternative to traditional API for Web3 users

## Getting Started

### 1. Traditional Authentication

```tsx
import { useAuth } from "@/context/auth-context";

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
      // User is now authenticated
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.firstName}!</div>;
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### 2. Wallet Connection (Optional)

```tsx
import { useWeb3Operations } from "@/hooks/use-web3-operations";

function WalletComponent() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3Operations();

  if (!isConnected) {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
}
```

### 3. Blockchain Operations

```tsx
import { useBlockchain } from "@/hooks/use-blockchain";

function BlockchainComponent() {
  const { 
    isConnected, 
    createNewFanClub, 
    joinExistingFanClub,
    getReputation 
  } = useBlockchain();

  const handleCreateFanClub = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const result = await createNewFanClub("my-fan-club", "0.1");
      console.log("Fan club created:", result);
    } catch (error) {
      console.error("Failed to create fan club:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateFanClub} disabled={!isConnected}>
        Create Fan Club
      </button>
    </div>
  );
}
```

## Available Operations

### Traditional API Operations (via `useAuth`)
- User login/logout
- User profile management
- Standard CRUD operations

### Web3 Operations (via `useWeb3Operations`)
- Wallet connection/disconnection
- Network switching
- Generic operation execution

### Blockchain Operations (via `useBlockchain`)

#### Fan Clubs
- `createNewFanClub(fanClubId, price)` - Create fan club
- `joinExistingFanClub(fanClubId, price)` - Join fan club
- `leaveExistingFanClub(fanClubId)` - Leave fan club
- `updateFanClubJoinPrice(fanClubId, newPrice)` - Update price
- `withdrawFanClubFunds(fanClubId, amount)` - Withdraw funds

#### Reputation
- `getReputation(userAddress)` - Get user reputation
- `updateReputation(userAddress, data)` - Update reputation

#### Marketplace
- `createFanClubMarketplace(fanClubId, tokenAddress)` - Create marketplace
- `depositTokensToFanClub(fanClubId, tokenAddress, amount)` - Deposit tokens
- `withdrawTokensFromFanClub(fanClubId, tokenAddress, amount)` - Withdraw tokens
- `rewardTokensToUser(fanClubId, tokenAddress, recipient, amount)` - Reward tokens

#### Utility Functions
- `formatUserAddress(address)` - Format address display
- `formatTokenAmount(amount)` - Format token amounts
- `switchNetwork()` - Switch to correct network

## Error Handling

All operations include comprehensive error handling:

```tsx
const { createNewFanClub } = useBlockchain();

const handleCreateFanClub = async () => {
  try {
    const result = await createNewFanClub("my-club", "0.1");
    if (result) {
      // Success - toast notification is automatically shown
      console.log("Fan club created:", result);
    }
  } catch (error) {
    // Error - toast notification is automatically shown
    console.error("Failed to create fan club:", error);
  }
};
```

## State Management

### Authentication State
```tsx
const {
  user,           // User object or null
  isAuthenticated, // Boolean: authentication status
  isLoading,      // Boolean: loading state
} = useAuth();
```

### Web3 Operations State
```tsx
const {
  isConnected,    // Boolean: wallet connection status
  address,        // String: wallet address
  isLoading,      // Boolean: loading state
  error,          // String: error message
} = useWeb3Operations();
```

### Blockchain State
```tsx
const {
  isConnected,    // Boolean: wallet connection status
  address,        // String: wallet address
  isCorrectNetwork, // Boolean: correct network status
  isLoading,      // Boolean: loading state
  error,          // String: error message
  transactionState, // Object: transaction status
} = useBlockchain();
```

## Security Features

### Traditional Authentication
- JWT token-based authentication
- Secure password handling
- Session management

### Web3 Operations
- Network verification (Chiliz Spicy Testnet)
- Wallet signature verification
- Transaction confirmation
- Gas fee estimation

## Network Configuration

The system is configured for Chiliz Spicy Testnet:
- Chain ID: 88882
- RPC URL: https://spicy-rpc.chiliz.com
- Currency: CHZ
- Block Explorer: https://spicy-explorer.chiliz.com

## Troubleshooting

### Common Issues

1. **"User rejected the request"**
   - This happens when users reject wallet connection or transaction signing
   - Solution: Ask user to approve the request in their wallet

2. **"Wrong network"**
   - User is on incorrect blockchain network
   - Solution: Use `switchNetwork()` function to switch to Chiliz Spicy Testnet

3. **"Insufficient funds"**
   - User doesn't have enough CHZ for gas fees
   - Solution: Ask user to add CHZ to their wallet

4. **"Wallet not connected"**
   - User needs to connect their wallet for blockchain operations
   - Solution: Use `connectWallet()` function

### Debug Information

Use the Web3 Test Page (`/web3-test`) to:
- Check authentication status
- Verify wallet connection
- Test API calls
- View debug information

## Best Practices

1. **Always check wallet connection** before blockchain operations
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** during operations
4. **Verify network** before transactions
5. **Use toast notifications** for user feedback
6. **Separate concerns** between authentication and Web3 operations

## Migration Guide

If you're migrating from the old Web3 authentication system:

1. **Replace `useWeb3Api`** with `useWeb3Operations` for wallet management
2. **Use `useAuth`** for traditional authentication
3. **Use `useBlockchain`** for smart contract operations
4. **Update API calls** to use traditional authentication or Web3 API client
5. **Test thoroughly** to ensure all functionality works correctly 