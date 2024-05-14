const request = require('supertest');
const createServer = require('../../src/server');

const app = createServer();

describe('GET / health check', () => {
  it('should return 200', async () => {
    return await request(app).get('/').expect(200);
  });
});

describe('GET /search/', () => {
  it('should return 400', async () => {
    return request(app).get('/search/').expect(400);
  });
});
