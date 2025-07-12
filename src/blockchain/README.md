# TRBE Blockchain Contracts

This directory contains the smart contracts for the TRBE fan engagement platform, including FanClubs, ScoreUser, and NFTBadge contracts.

## Contracts

### FanClubs.sol
A comprehensive fan club management contract that allows:
- Creating fan clubs with membership fees
- Joining and leaving fan clubs
- Managing fan club balances and withdrawals
- Token and NFT management for fan clubs
- Owner-only operations for club management

### ScoreUser.sol
A reputation scoring contract that calculates user reputation based on social media activity.

### NFTBadge.sol
An ERC721 contract for minting and managing fan badges/achievements.

### Mock Contracts
- **MockERC20.sol**: ERC20 token for testing token-related functions
- **MockERC721.sol**: ERC721 token for testing NFT-related functions

## Testing

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Hardhat

### Installation
```bash
npm install
```

### Running Tests

#### All Tests
```bash
npm test
```

#### Individual Contract Tests
```bash
# Test FanClubs contract
npm run test:fanclubs

# Test ScoreUser contract  
npm run test:scoreuser

# Test NFTBadge contract
npm run test:nftbadge

# Run all contract tests
npm run test:all
```

#### Automated Test Setup
```bash
npm run run-tests
```

### Test Coverage

#### FanClubs Tests
- **Deployment**: Contract deployment verification
- **Fan Club Creation**: Creating clubs, validation, owner assignment
- **Membership Management**: Joining, leaving, member validation
- **Price Management**: Updating join prices, owner restrictions
- **Financial Operations**: Deposits, withdrawals, balance tracking
- **Token Management**: ERC20 token deposits, withdrawals, rewards
- **NFT Management**: ERC721 NFT deposits, withdrawals, rewards
- **View Functions**: All public view functions and access controls
- **Edge Cases**: Multiple clubs, large member lists, security scenarios

#### NFTBadge Tests
- **Deployment**: Name, symbol, owner verification
- **Minting**: Owner-only minting, token ID increments
- **ERC721 Standard**: All standard ERC721 functions
- **Transfer Operations**: Transfers, approvals, ownership changes
- **Access Control**: Owner restrictions, unauthorized access prevention
- **Token URI**: Base URI and token URI functionality
- **Ownership Management**: Ownership transfers and restrictions
- **Edge Cases**: Multiple mints, large token IDs, approval management

#### ScoreUser Tests
- **Reputation Calculation**: Core reputation scoring logic
- **Parameter Validation**: Input validation and error handling
- **Access Control**: Function access restrictions

### Test Structure
Tests are organized using describe blocks for better readability:
- Each contract has its own test file
- Tests are grouped by functionality
- Edge cases and security scenarios are included
- Gas optimization tests are included where relevant

### Mock Contracts
The test suite uses mock contracts to simulate external token interactions:
- **MockERC20**: Simulates ERC20 tokens for fan club token operations
- **MockERC721**: Simulates ERC721 tokens for fan club NFT operations

These mocks allow testing of complex interactions without deploying real tokens.

## Deployment

### Networks
- **Chiliz Spicy Testnet**: Test network for development
- **Chiliz Mainnet**: Production network

### Environment Variables
Create a `.env` file with:
```env
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

### Deploy Commands
```bash
# Deploy to testnet
npm run deploy

# Deploy specific contract
npx hardhat run scripts/deploy.js --network spicy
```

## Contract Addresses

### Chiliz Spicy Testnet
- FanClubs: `0x...`
- ScoreUser: `0x...`
- NFTBadge: `0x...`

### Chiliz Mainnet
- FanClubs: `0x...`
- ScoreUser: `0x...`
- NFTBadge: `0x...`

## Security Considerations

### Access Control
- All critical functions are protected by `onlyOwner` modifiers
- Fan club operations require proper ownership verification
- Token and NFT operations include proper validation

### Input Validation
- All user inputs are validated
- Address validation prevents zero address operations
- Amount validation prevents zero-value transactions

### Reentrancy Protection
- External calls are made at the end of functions
- State changes occur before external interactions

## Gas Optimization

### Current Gas Usage
- FanClubs deployment: ~2.5M gas
- NFTBadge deployment: ~1.8M gas
- ScoreUser deployment: ~1.2M gas

### Optimization Strategies
- Efficient storage patterns
- Minimal external calls
- Optimized loops and data structures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details
