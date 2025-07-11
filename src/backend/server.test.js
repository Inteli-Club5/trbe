const request = require('supertest');
const app = require('./server');

jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');

  class MockTransactionResponse {
    constructor() {
      this.hash = '0xmockedtxhash';
    }
    wait() {
      return Promise.resolve(true);
    }
  }
  class MockBigNumber {
    toString() {
      return '42';
    }
  }
  const mockContract = {
    calculateReputation: jest.fn(() => Promise.resolve(new MockTransactionResponse())),
    getReputation: jest.fn(() => Promise.resolve(new MockBigNumber())),
  };

  return {
    ...original,
    Contract: jest.fn(() => mockContract),
    JsonRpcProvider: jest.fn(),
    Wallet: jest.fn(() => ({
      connect: jest.fn(() => mockContract),
    })),
    getAddress: (address) => {
      if (typeof address !== 'string' || !address.startsWith('0x') || address.length !== 42) {
        throw new Error('invalid address');
      }
      return address;
    },
  };
});

describe('ScoreUser API', () => {

  describe('GET /', () => {
    it('should return 200 and a welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('ScoreUser Express API is running!');
    });
  });

  describe('POST /calculateReputation', () => {
    it('should return 400 if any param is missing', async () => {
      const res = await request(app)
        .post('/calculateReputation')
        .send({ user: '0x0000000000000000000000000000000000000000' }); 

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('All parameters are required.');
    });

    it('should return 400 for invalid user address', async () => {
      const res = await request(app)
        .post('/calculateReputation')
        .send({
          user: 'invalidaddress',
          likes: 1,
          comments: 2,
          retweets: 3,
          hashtag: true,
          checkEvents: true,
          gamesId: 123,
          reports: 0
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid user address.');
    });
  });

  describe('GET /getReputation/:userAddress', () => {
    it('should return 400 for invalid user address', async () => {
      const res = await request(app).get('/getReputation/invalidaddress');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid user address.');
    });
  });
});
