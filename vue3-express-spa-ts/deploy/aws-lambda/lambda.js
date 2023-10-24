process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const serverlessHttp = require('serverless-http');

const app = require('../server/app');

module.exports.handler = serverlessHttp(app, {
  requestId: false,
});
