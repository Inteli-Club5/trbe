const request = require('supertest');

let app;

beforeAll(() => {
  process.env.RPC_URL = 'https://test-rpc.com';
  process.env.CHAIN_ID = '88882';
  process.env.CONTRACT_ADDRESS_SCORE_USER = '0x0000000000000000000000000000000000000001';
  process.env.CONTRACT_ADDRESS_FAN_CLUBS = '0x0000000000000000000000000000000000000002';
  process.env.PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  jest.resetModules();
  app = require('./server');
});

describe('TRBE Backend API', () => {
  it('should return 200 and welcome message at root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('TRBE Backend API is running!');
  });

  it('should return 400 for invalid user address on /getReputation/:userAddress', async () => {
    const res = await request(app).get('/getReputation/invalidaddress');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid user address.');
  });

  it('should return 400 for missing parameters on /calculateReputation', async () => {
    const res = await request(app)
      .post('/calculateReputation')
      .send({ user: '0x0000000000000000000000000000000000000000' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All parameters are required.');
  });
});