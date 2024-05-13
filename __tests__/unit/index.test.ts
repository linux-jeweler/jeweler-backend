import supertest from 'supertest';
import app from '../../src/server';

describe('health check', () => {
  it('should return 200', async () => {
    return supertest(app).get('/').expect(200);
  });
});
