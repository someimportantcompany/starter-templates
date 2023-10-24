import express from 'express';
import supertest from 'supertest';

import { api } from '../api';

export function request() {
  const app = express();
  app.use(api);
  return supertest(app);
}
