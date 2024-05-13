const request = require('supertest');
const createServer = require('../../src/server');

const app = createServer();

describe('health check', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/');
    console.log(response.body);
    expect(response).toBe(200);
  });
});

describe('/search/', () => {
  it('should return 400', async () => {
    return request(app).get('/search/').expect(400);
  });
});
