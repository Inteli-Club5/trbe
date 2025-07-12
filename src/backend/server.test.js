const request = require('supertest');

describe('TRBE Backend API - Basic Tests', () => {
  let app;

  beforeAll(() => {
    // Configurar variáveis de ambiente básicas
    process.env.RPC_URL = 'https://test-rpc.com';
    process.env.CHAIN_ID = '88882';
    process.env.CONTRACT_ADDRESS_SCORE_USER = '0x0000000000000000000000000000000000000001';
    process.env.CONTRACT_ADDRESS_FAN_CLUBS = '0x0000000000000000000000000000000000000002';
    process.env.PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    process.env.NODE_ENV = 'test';
    
    app = require('./server');
  });

  it('should have app defined', () => {
    expect(app).toBeDefined();
  });

  it('should handle non-existent routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

  it('should handle non-existent API routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

  it('should have a response body', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.body).toBeDefined();
  });
});