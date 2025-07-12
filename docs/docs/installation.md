# Installation Guide

This guide will help you set up and run the trbe project in your development environment.

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v18.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **PostgreSQL** (v14 or higher)
- **Git**
- **MetaMask** or compatible Web3 wallet

## Step 1: Clone the Repository

```bash
git clone https://github.com/Inteli-Club5/trbe.git
cd trbe
```

## Step 2: Set Up Backend

```bash
cd src/backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start backend server
npm run dev
```

## Step 3: Set Up Frontend

```bash
cd src/frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start frontend development server
npm run dev
```

## Step 4: Set Up Blockchain

```bash
cd src/blockchain
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet (requires .env configuration)
npm run deploy
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/trbe_db"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
RPC_URL="https://spicy-rpc.chiliz.com"
CHAIN_ID=88882
CONTRACT_ADDRESS_SCORE_USER="0xF4Bf9ac700b4f394181D6dFe5a40fB2f229B1fB2"
CONTRACT_ADDRESS_FAN_CLUBS="0x82fbDD75F982cd2D8BeAcf73CA1980286e64Ed8f"
PRIVATE_KEY="your-private-key"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_RPC_URL="https://spicy-rpc.chiliz.com"
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CONTRACT_ADDRESS_SCORE_USER="0xF4Bf9ac700b4f394181D6dFe5a40fB2f229B1fB2"
NEXT_PUBLIC_CONTRACT_ADDRESS_FAN_CLUBS="0x82fbDD75F982cd2D8BeAcf73CA1980286e64Ed8f"
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run `npx prisma db push` to create tables

2. **Blockchain Connection Error**
   - Verify RPC_URL is accessible
   - Check CHAIN_ID matches network
   - Ensure private key is valid

3. **Frontend Build Error**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Support

For additional support:
- Check the [Technologies Overview](/docs/technologies/overview)
- Review [Backend Documentation](/docs/technologies/backend)
- Review [Blockchain Documentation](/docs/technologies/blockchain)
- Open an issue on GitHub 