# Trybe Backend API

This is the backend API for the Trybe project. It provides endpoints for interacting with smart contracts (ScoreUser and FanClubs) and managing user reputation and fan club membership.

## Features
- Calculate and retrieve user reputation
- Manage fan club creation, membership, and pricing
- Input validation and error handling

## Requirements
- Node.js (v16 or higher recommended)
- npm or compatible package manager

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `src/backend` directory with the following variables:
   ```env
   RPC_URL=YOUR_RPC_URL
   CHAIN_ID=YOUR_CHAIN_ID
   CONTRACT_ADDRESS_SCORE_USER=YOUR_SCORE_USER_CONTRACT_ADDRESS
   CONTRACT_ADDRESS_FAN_CLUBS=YOUR_FAN_CLUBS_CONTRACT_ADDRESS
   PRIVATE_KEY=YOUR_PRIVATE_KEY
   ```
   Replace each value with your actual configuration.

## Running the Server
From the `src/backend` directory, start the server with:
```bash
npm start
```
The server will run on port 3001 by default.

## Running Tests
To run the test suite:
```bash
npm test
```

## Example API Endpoints
- `GET /` — Health check, returns a welcome message.
- `POST /calculateReputation` — Calculate reputation for a user. Requires JSON body with all parameters.
- `GET /getReputation/:userAddress` — Get the reputation for a user address.

Other endpoints for fan club management are available if the contracts are deployed and configured.

## Environment Variables
| Variable                        | Description                        |
|----------------------------------|------------------------------------|
| RPC_URL                         | RPC endpoint for blockchain        |
| CHAIN_ID                        | Chain ID of the network            |
| CONTRACT_ADDRESS_SCORE_USER      | Address of ScoreUser contract      |
| CONTRACT_ADDRESS_FAN_CLUBS      | Address of FanClubs contract       |
| PRIVATE_KEY                     | Private key for contract actions   |

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT 