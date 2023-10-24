const express = require('express');
const serveStatic = require('serve-static');

const { api: apiRouter, logger } = require('./dist/backend/api');
const { configureExpress, configureMiddleware } = require('./common');
const { frontendClientPath, indexPage, indexEtag } = require('./utils');

const app = express();

configureExpress(app);
app.use(configureMiddleware(logger));

app.use('/api', apiRouter);
app.get('/status', (_, res) => res.status(200).set('Content-Type', 'text/plain').send(':+1:'));

app.get('*', serveStatic(frontendClientPath, {
  dotfiles: 'ignore',
  etag: true,
  fallthrough: true,
  index: false,
  redirect: false,
}));

app.get([ '/assets/*', '/static/*' ], (_, res) => res.status(404).send());

app.get('*', async (req, res) => {
  try {
    res.status(200)
      .set('Content-Type', 'text/html')
      .set('Etag', indexEtag)
      .send(indexPage);
  } catch (err) {
    req.log.error(err);
    res.status(200).set('Content-Type', 'text/plain').send(err.toString());
  }
});

app.use((_, res) => res.status(405).send());

module.exports = app;
