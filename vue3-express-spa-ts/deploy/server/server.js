process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const http = require('http');
// const https = require('https');
const minimist = require('minimist');

const app = require('./app');

const args = minimist(process.argv.slice(2), {
  string: [ 'httpHost' ],
});

const config = {
  httpHost: process.env.HTTP_HOST || args.httpHost || 'localhost',
  httpPort: parseInt(process.env.HTTP_PORT || args.httpHost || 'null', 10) || 4000,
  // @TODO Add https support
};

// const server = config.https ? https.createServer(config.https, app) : http.createServer(app);
const server = http.createServer(app);

server.on('listening', () => {
  /* eslint-disable no-console */
  const { address, port } = server.address();
  console.log(`Server listening on http://${address}:${port}`);
});

server.on('error', (err) => {
  /* eslint-disable no-console */
  if (err.syscall === 'listen') {
    switch (err.code) {
      case 'EACCES':
        console.error(`Port ${config.httpPort} requires elevated privileges`);
        return process.exit(1);
      case 'EADDRINUSE':
        console.error(`Port ${config.httpPort} is already in use`);
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

server.listen(config.httpPort, config.httpHost, undefined, undefined);
