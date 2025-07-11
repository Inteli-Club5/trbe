jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');

  class MockTx {
    constructor() {
      this.hash = '0xmockedtxhash';
    }
    wait() {
      return Promise.resolve();
    }
  }

  const mockContract = {
    createFanClub: jest.fn(() => new MockTx()),
    joinFanClub: jest.fn(() => new MockTx()),
    leaveFanClub: jest.fn(() => new MockTx()),
    updatePrice: jest.fn(() => new MockTx()),
    withdraw: jest.fn(() => new MockTx()),
    checkMember: jest.fn(() => Promise.resolve(true)),
    getBalance: jest.fn(() => Promise.resolve('42')),
    getJoinPrice: jest.fn(() => Promise.resolve('42')),
    getMembers: jest.fn(() => Promise.resolve(['0xabc'])),
  };

  return {
    ...original,
    Contract: jest.fn(() => mockContract),
    Wallet: jest.fn(() => ({})),
    providers: {
      JsonRpcProvider: jest.fn(() => ({})),
    },
  };
});

const request = require('supertest');
const app = require('./server');

describe('FanClubs API', () => {
  it('GET / should respond with API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('GET /fanclub/:fanClubId/balance should respond', async () => {
    const res = await request(app).get('/fanclub/club1/balance');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  it('GET /fanclub/:fanClubId/price should respond', async () => {
    const res = await request(app).get('/fanclub/club1/price');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  it('GET /fanclub/:fanClubId/members should respond', async () => {
    const res = await request(app).get('/fanclub/club1/members');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  it('POST /fanclub/:fanClubId/join should respond', async () => {
    const res = await request(app).post('/fanclub/club1/join');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  it('POST /fanclub/:fanClubId/leave should respond', async () => {
    const res = await request(app).post('/fanclub/club1/leave');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  it('POST /fanclub/:fanClubId/updatePrice should respond', async () => {
    const res = await request(app)
      .post('/fanclub/club1/updatePrice')
      .send({ newPrice: '500' });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});


describe('ScoreUser API', () => {
  describe('GET /', () => {
    it('should return 200 and a welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Trybe Backend API is running!');
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