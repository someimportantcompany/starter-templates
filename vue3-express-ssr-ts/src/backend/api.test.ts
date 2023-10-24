import assert from 'assert';

import { request } from './test/request';

describe('api', () => {

  it('should respond to GET /', async () => {
    await request()
      .get('/')
      .expect(200)
      .expect({ message: 'Hello, world' });
  });

  it('should respond to POST /', async () => {
    await request()
      .post('/')
      .expect(200)
      .expect(res => assert(typeof res.body === 'string', 'Expected a string to be returned'));
  });

});
