const supertest = require('supertest');

describe('deploy/server', () => describe('app', () => {
  const app = require('./app');

  it('should return early for GET /status', async () => {
    await supertest(app)
      .get('/status')
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(':+1:');
  });

  it('should return for GET /api', async () => {
    await supertest(app)
      .get('/api')
      .expect(200)
      .expect({ message: 'Hello, world' });
  });

  it('should return for GET /', async () => {
    await supertest(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
}));
