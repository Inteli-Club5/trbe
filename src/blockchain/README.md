# Blockchain - Smart Contracts and Tests

This directory contains the smart contracts and tests for the Trybe application.

## Network Information

**Deployment Network**: Chiliz Spicy Testnet
- **RPC URL**: https://spicy-rpc.chiliz.com
- **Chain ID**: 88882
- **Block Explorer**: https://spicy-explorer.chiliz.com
- **Testnet Faucet**: https://spicy-faucet.chiliz.com

## Contracts

### FanClubs.sol
Main contract for fan club management with the following features:

#### Basic Features:
- **createFanClub**: Create a new fan club
- **join**: Join a fan club (paying fee)
- **leave**: Leave a fan club
- **updatePrice**: Update entry price (owner only)
- **withdraw**: Withdraw funds from fan club (owner only)

#### View Functions:
- **getMembers**: List fan club members
- **checkMember**: Check if a user is a member
- **getJoinPrice**: Get entry price
- **getOwner**: Get fan club owner
- **getBalance**: Get fan club balance (owner only)

#### ERC20 Token Features:
- **depositFanTokens**: Deposit ERC20 tokens to fan club
- **withdrawFanTokens**: Withdraw ERC20 tokens (owner only)
- **rewardFanToken**: Reward members with tokens (owner only)
- **getFanTokenBalance**: Get token balance (owner only)

### MockERC20.sol
Mock contract for ERC20 token testing.

## Tests

### FanClubs.test.js
Comprehensive tests for all FanClubs contract features:

#### Test Coverage:
1. **Constructor**: Deploy verification
2. **createFanClub**: Fan club creation
3. **join**: Fan club joining
4. **leave**: Fan club leaving
5. **updatePrice**: Price updates
6. **withdraw**: Fund withdrawals
7. **Fan Token Functions**: ERC20 token features
8. **View Functions**: View functions
9. **Edge Cases and Security**: Edge cases and security

## How to Run

### Install Dependencies
```bash
cd src/blockchain
npm install
```

### Compile Contracts
```bash
npm run compile
```

### Run All Tests
```bash
npm test
```

### Run Only FanClubs Tests
```bash
npm run test:fanclubs
```

### Run Only ScoreUser Tests
```bash
npm run test:scoreuser
```

### Run All Test Suites Sequentially
```bash
npm run test:all
```

### Available Scripts
- `npm test` - Run all tests
- `npm run compile` - Compile contracts only
- `npm run test:fanclubs` - Run only FanClubs tests
- `npm run test:scoreuser` - Run only ScoreUser tests
- `npm run test:all` - Run both test suites sequentially
- `npm run run-tests` - Complete setup and test execution
- `npm run deploy` - Deploy to Spicy Testnet

### Run Complete Script (Install + Compile + Tests)
```bash
npm run run-tests
```

This script will:
1. Install dependencies if needed
2. Compile all contracts
3. Run all tests together
4. Run individual test suites separately for detailed results

### Deploy Contracts to Spicy Testnet
```bash
npm run deploy
```

**Note**: This will deploy to Chiliz Spicy Testnet. Make sure you have:
- Testnet CHZ tokens for gas fees
- Correct network configuration in `hardhat.config.js`
- Valid private key in `.env` file

## Configuration

### Environment Variables
Create a `.env` file in the `blockchain` directory root:

```env
# Network Configuration
RPC_URL=https://spicy-rpc.chiliz.com
CHAIN_ID=88882

# Wallet Configuration
PRIVATE_KEY=your_private_key_here
```

## Test Structure

### Organization
- **describe**: Groups tests by functionality
- **beforeEach**: Common setup for each test
- **it**: Individual tests
- **expect**: Assertions to verify results

### Test Types
1. **Positive Tests**: Verify that features work correctly
2. **Negative Tests**: Verify that errors are handled properly
3. **Security Tests**: Verify permissions and access
4. **Edge Case Tests**: Verify extreme cases

### Test Examples

#### Positive Test
```javascript
it("Should successfully create a fan club", async function () {
    await fanClubs.connect(owner).createFanClub(clubId, price);
    const clubOwner = await fanClubs.getOwner(clubId);
    expect(clubOwner).to.equal(owner.address);
});
```

#### Negative Test
```javascript
it("Should revert if fan club ID already exists", async function () {
    await fanClubs.connect(owner).createFanClub(clubId, price);
    await expect(
        fanClubs.connect(owner).createFanClub(clubId, price)
    ).to.be.revertedWith("Fan club already exists");
});
```

## Expected Results

When running tests, you should see:
- ✅ All tests passing
- 📊 Complete feature coverage
- 🔒 Security verification
- 🧪 Edge case validation

## Troubleshooting

### Compilation Error
- Check if all dependencies are installed
- Run `npm run compile` to see detailed errors

### Test Error
- Check if Hardhat is configured correctly
- Run `npm run test:fanclubs` to see specific errors

### Deploy Error
- Check if environment variables are configured
- Confirm if the network is accessible
- Check if the wallet has sufficient balance

### Getting Testnet Tokens
To deploy contracts on Chiliz Spicy Testnet, you need testnet CHZ tokens:
1. Visit the [Spicy Faucet](https://spicy-faucet.chiliz.com)
2. Connect your wallet
3. Request testnet CHZ tokens
4. Wait for the transaction to be confirmed

### Verifying Contracts
After deployment, you can verify your contracts on the block explorer:
1. Visit [Spicy Explorer](https://spicy-explorer.chiliz.com)
2. Search for your contract address
3. Verify the contract source code (if needed)
4. Interact with the contract through the explorer
