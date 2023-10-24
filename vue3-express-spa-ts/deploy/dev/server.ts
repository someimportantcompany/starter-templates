/* eslint-disable import/first */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import http from 'http';
import type { AddressInfo } from 'net';

import { api as apiRouter, logger } from '../../src/backend/api';
import vite, { indexPagePath } from '../../src/frontend/dev-server';

// @ts-ignore
import { configureExpress, configureMiddleware } from '../server/common';

const { HTTP_HOST, HTTP_PORT } = process.env;

const app = express();
const server = http.createServer(app);

configureExpress(app);
app.use(configureMiddleware(logger));
app.use('/api', apiRouter);
app.get('/status', (_, res) => res.status(200).set('Content-Type', 'text/plain').send(':+1:'));

app.use(async (req, res, next) => {
  try {
    (await vite).middlewares(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get('*', async (_, res, next) => {
  try {
    res.status(200).set('Content-Type', 'text/html').sendFile(indexPagePath);
  } catch (err) {
    next(err);
  }
});

app.use((_, res) => res.status(405).send());

server.on('listening', () => {
  /* eslint-disable no-console */
  const { address, port } = server.address() as AddressInfo;
  console.log(`Server listening on http://${address}:${port}`);
});

server.on('error', (err: any) => {
  /* eslint-disable no-console */
  if (err.syscall === 'listen') {
    switch (err.code) {
      case 'EACCES':
        console.error(`Port ${HTTP_PORT || 4000} requires elevated privileges`);
        return process.exit(1);
      case 'EADDRINUSE':
        console.error(`Port ${HTTP_PORT || 4000} is already in use`);
        return process.exit(1);
    }
  }

  throw err;
});

process.on("uncaughtException", (err) => {
  /* eslint-disable no-console */
  console.error('uncaughtException', err);
  process.exit(1)
});

process.on("unhandledRejection", (err) => {
  /* eslint-disable no-console */
  console.error('unhandledRejection', err);
  process.exit(1);
});

server.listen(Number(HTTP_PORT) || 4000, HTTP_HOST || 'localhost', undefined, undefined);
