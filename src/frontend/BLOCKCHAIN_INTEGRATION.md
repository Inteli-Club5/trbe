# 🚀 Blockchain Integration Guide

This guide explains how the TRBE frontend integrates with the Chiliz blockchain for fan engagement features.

## 📋 Overview

The frontend integrates with two main smart contracts:
- **FanClubs**: Manages fan club creation, joining, and membership
- **ScoreUser**: Handles reputation scoring based on social media activity

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file in the `src/frontend/` directory:

```env
# Blockchain Configuration
NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CHAIN_NAME="Chiliz Spicy Testnet"
NEXT_PUBLIC_CURRENCY_SYMBOL=CHZ

# Contract Addresses (Chiliz Spicy Testnet)
NEXT_PUBLIC_FAN_CLUBS_CONTRACT=0x7735eD58ea943Ee6EF611F853d44eeF08d0151e7
NEXT_PUBLIC_SCORE_USER_CONTRACT=0xb3eDdd3b7fd6946F9242b90a4e750c7f9a4B6d85

# App Configuration
NEXT_PUBLIC_APP_NAME=TRBE
NEXT_PUBLIC_APP_DESCRIPTION="Fan Engagement Platform"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Dependencies

The following packages are required:

```json
{
  "ethers": "^5.7.2",
  "@reown/appkit": "^1.0.0"
}
```

## 🏗️ Architecture

### Core Components

1. **Blockchain Utilities** (`lib/blockchain.ts`)
   - Contract interactions
   - Transaction handling
   - Network management

2. **React Hooks**
   - `useBlockchain`: Main blockchain connection
   - `useFanClubs`: Fan club operations
   - `useReputation`: Reputation management

3. **UI Components**
   - `BlockchainStatus`: Connection status display
   - `ConnectButton`: Wallet connection

### File Structure

```
src/frontend/
├── lib/
│   ├── blockchain.ts          # Blockchain utilities
│   ├── contracts.ts           # Contract types
│   └── types.ts              # TypeScript types
├── hooks/
│   ├── use-blockchain.ts     # Main blockchain hook
│   ├── use-fan-clubs.ts      # Fan club operations
│   ├── use-reputation.ts     # Reputation management
│   └── use-toast.ts          # Toast notifications
├── components/
│   ├── blockchain-status.tsx # Status component
│   └── connection-button.tsx # Wallet connection
└── app/
    ├── clubs/page.tsx        # Fan clubs page
    ├── reputation/page.tsx   # Reputation page
    ├── wallet/page.tsx       # Wallet page
    └── blockchain-demo/page.tsx # Demo page
```

## 🔌 Integration Points

### 1. Wallet Connection

The app uses AppKit for wallet connection:

```tsx
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";

const { address, isConnected } = useAppKitAccount();
const appKit = useAppKit();
```

### 2. Fan Club Operations

```tsx
import { useFanClubs } from "@/hooks/use-fan-clubs";

const fanClubs = useFanClubs();

// Create fan club
await fanClubs.createFanClub("chelsea", "0.1");

// Join fan club
await fanClubs.joinFanClub("chelsea", "0.1");

// Leave fan club
await fanClubs.leaveFanClub("chelsea");
```

### 3. Reputation Management

```tsx
import { useReputation } from "@/hooks/use-reputation";

const reputation = useReputation();

// Update reputation
await reputation.updateFromSocialActivity({
  likes: 10,
  comments: 5,
  retweets: 3,
});

// Quick actions
await reputation.addLikes(1);
await reputation.addComments(1);
await reputation.addRetweets(1);
```

## 🎯 Features

### 1. Fan Clubs
- ✅ Create new fan clubs
- ✅ Join existing fan clubs
- ✅ Leave fan clubs
- ✅ View membership status
- ✅ Manage club prices (owner only)

### 2. Reputation System
- ✅ Update reputation based on social activity
- ✅ Quick reputation actions
- ✅ Reputation levels and badges
- ✅ Real-time reputation display

### 3. Wallet Management
- ✅ Connect/disconnect wallet
- ✅ Network switching
- ✅ Address display and copying
- ✅ Transaction status tracking

### 4. Transaction Handling
- ✅ Automatic transaction confirmation
- ✅ Error handling and user feedback
- ✅ Loading states
- ✅ Toast notifications

## 🚀 Usage Examples

### Basic Integration

```tsx
import { useBlockchain } from "@/hooks/use-blockchain";
import { BlockchainStatus } from "@/components/blockchain-status";

export default function MyPage() {
  const blockchain = useBlockchain();

  return (
    <div>
      <BlockchainStatus />
      {blockchain.isConnected ? (
        <p>Connected: {blockchain.formatUserAddress(blockchain.address)}</p>
      ) : (
        <button onClick={blockchain.connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Fan Club Integration

```tsx
import { useFanClubs } from "@/hooks/use-fan-clubs";

export default function ClubsPage() {
  const fanClubs = useFanClubs();

  const handleJoinClub = async (clubId: string) => {
    const success = await fanClubs.joinFanClub(clubId, "0.1");
    if (success) {
      console.log("Successfully joined club!");
    }
  };

  return (
    <div>
      {fanClubs.isMember("chelsea") ? (
        <button onClick={() => fanClubs.leaveFanClub("chelsea")}>
          Leave Chelsea
        </button>
      ) : (
        <button onClick={() => handleJoinClub("chelsea")}>
          Join Chelsea
        </button>
      )}
    </div>
  );
}
```

### Reputation Integration

```tsx
import { useReputation } from "@/hooks/use-reputation";

export default function ReputationPage() {
  const reputation = useReputation();

  const handleSocialActivity = async () => {
    await reputation.updateFromSocialActivity({
      likes: 5,
      comments: 2,
      retweets: 1,
    });
  };

  return (
    <div>
      <h2>Reputation: {reputation.reputation}</h2>
      <p>Level: {reputation.getReputationLevel(reputation.reputation)}</p>
      <button onClick={handleSocialActivity}>Record Activity</button>
    </div>
  );
}
```

## 🔧 Configuration

### Network Configuration

The app is configured for Chiliz Spicy Testnet by default:

- **Chain ID**: 88882
- **RPC URL**: https://spicy-rpc.chiliz.com
- **Currency**: CHZ
- **Block Explorer**: https://spicy-explorer.chiliz.com/

### Contract Addresses

Current deployed contracts on Spicy Testnet:

- **FanClubs**: `0x7735eD58ea943Ee6EF611F853d44eeF08d0151e7`
- **ScoreUser**: `0xb3eDdd3b7fd6946F9242b90a4e750c7f9a4B6d85`

## 🧪 Testing

### Demo Page

Visit `/blockchain-demo` to test all blockchain functionality:

1. **Wallet Connection**: Connect your wallet
2. **Fan Clubs**: Create, join, and leave fan clubs
3. **Reputation**: Update reputation with social activity
4. **Transactions**: Monitor transaction status

### Test Scenarios

1. **Wallet Connection**
   - Connect MetaMask or other wallet
   - Switch to Chiliz Spicy Testnet
   - Verify connection status

2. **Fan Club Operations**
   - Create a new fan club
   - Join an existing fan club
   - Leave a fan club
   - Verify membership status

3. **Reputation System**
   - Update reputation with social activity
   - Use quick action buttons
   - Verify reputation score changes

4. **Error Handling**
   - Test with wrong network
   - Test with insufficient funds
   - Test with invalid inputs

## 🚨 Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Automatic network switching
- **Transaction Errors**: User-friendly error messages
- **Connection Errors**: Fallback RPC providers
- **Validation Errors**: Input validation and feedback

## 🔒 Security

- **Input Validation**: All user inputs are validated
- **Transaction Confirmation**: Users must confirm all transactions
- **Network Verification**: Automatic network detection
- **Error Boundaries**: Graceful error handling

## 📱 Mobile Support

The blockchain integration works on mobile devices:

- **MetaMask Mobile**: Full support
- **WalletConnect**: Compatible
- **Mobile Browsers**: Responsive design
- **Touch Interactions**: Optimized for touch

## 🚀 Deployment

### Railway Deployment

The app is configured for Railway deployment with:

- **Environment Variables**: Set in Railway dashboard
- **Build Configuration**: Automatic build and deploy
- **Domain**: Custom domain support
- **SSL**: Automatic SSL certificates

### Environment Setup

1. Set environment variables in Railway dashboard
2. Deploy the application
3. Verify blockchain connection
4. Test all functionality

## 📚 Additional Resources

- [Chiliz Documentation](https://docs.chiliz.com/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [AppKit Documentation](https://docs.reown.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Support

For issues or questions:

1. Check the demo page at `/blockchain-demo`
2. Review the console for error messages
3. Verify network connection
4. Check contract addresses
5. Ensure wallet is connected to correct network 