import e from "express";

const request = require('supertest');
const createServer = require('../../src/server');

const app = createServer();

describe('health check', () => {
  it('should return 200', async () => {
    return await request(app).get('/').expect(200);
  });
});

describe('/search/', () => {
  it('should return 400', async () => {
    return request(app).get('/search/').expect(400);
  });
});
