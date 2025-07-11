const request = require('supertest');
const express = require('express');
const { ethers } = require('ethers');

jest.mock('ethers');

describe('FanClub API', () => {
  let mockContract;

  beforeAll(() => {

    const mockSigner = { address: '0xtestsigner' };
    global.signer = mockSigner;
    global.provider = {}; 

    mockContract = {
      joinPrice: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000')),
      owner: jest.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678'),
      checkMember: jest.fn().mockResolvedValue(true),
      getMembers: jest.fn().mockResolvedValue([
        '0x1234567890abcdef1234567890abcdef12345678',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      ]),
      join: jest.fn().mockResolvedValue({ hash: '0xtxjoin', wait: jest.fn() }),
      leave: jest.fn().mockResolvedValue({ hash: '0xtxleave', wait: jest.fn() }),
      updatePrice: jest.fn().mockResolvedValue({ hash: '0xtxupdate', wait: jest.fn() }),
      withdraw: jest.fn().mockResolvedValue({ hash: '0xtxwithdraw', wait: jest.fn() }),
    };

    global.contract = mockContract;
    ethers.Contract.mockImplementation(() => mockContract);
    ethers.utils.parseEther = jest.fn((eth) => ethers.BigNumber.from('1000000000000000000'));
    ethers.utils.formatEther = jest.fn((wei) => '1.0');
    ethers.utils.isAddress = jest.fn().mockReturnValue(true);


     ({ app, initializeContract } = require('./server.js'));
    initializeContract();
  });

  test('GET /owner returns the owner', async () => {
    const res = await request(app).get('/owner');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      owner: '0x1234567890abcdef1234567890abcdef12345678',
    });
  });

  test('GET /check-member/:userAddress returns if it is a member', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const res = await request(app).get(`/check-member/${address}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      user: address,
      isMember: true,
    });
  });

  test('GET /members returns a member list', async () => {
    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(200);
    expect(res.body.members.length).toBe(2);
  });

  test('POST /join works fine', async () => {
    const res = await request(app)
      .post('/join')
      .send({ amountEth: '1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.transactionHash).toBe('0xtxjoin');
  });

  test('POST /leave works fine', async () => {
    const res = await request(app).post('/leave');
    expect(res.statusCode).toBe(200);
    expect(res.body.transactionHash).toBe('0xtxleave');
  });

  test('POST /update-price updates the price', async () => {
    const res = await request(app)
      .post('/update-price')
      .send({ newPrice: '1000' });
    expect(res.statusCode).toBe(200);
    expect(res.body.transactionHash).toBe('0xtxupdate');
  });

  test('POST /withdraw works fine', async () => {
    const res = await request(app).post('/withdraw');
    expect(res.statusCode).toBe(200);
    expect(res.body.transactionHash).toBe('0xtxwithdraw');
  });
});
