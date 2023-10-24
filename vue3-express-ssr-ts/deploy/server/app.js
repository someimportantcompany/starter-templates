const express = require('express');
const etag = require('etag');
const serveStatic = require('serve-static');

const { api: apiRouter, logger } = require('./dist/backend/api');
const { configureExpress, configureMiddleware, createServerReqContext, renderTemplate } = require('./common');
const { frontendClientPath, indexPage, indexEtag, manifest, frontendSsr } = require('./utils');

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

app.get([ '/admin', '/admin/*' ], (_, res) => res
  .status(200)
  .set('Content-Type', 'text/html')
  .set('Etag', indexEtag)
  .send(indexPage));

app.get('*', async (req, res) => {
  try {
    const { render } = await frontendSsr;
    const { appHtml, headTags, server: serverRes } = await render(createServerReqContext(req), manifest);

    res.status(200).set('Content-Type', 'text/html');

    if (serverRes?.statusCode || serverRes?.headers) {
      // @ts-ignore - Dev server is unaware of req.log
      req.log.debug({ ssrRes: serverRes });

      if (serverRes?.statusCode) {
        res.status(serverRes.statusCode);
      }
      if (serverRes?.headers) {
        res.set(serverRes.headers);
      }
    }

    const html = renderTemplate(indexPage, { appHtml, headTags });
    res.set('Etag', etag(html, { weak: true }));
    res.send(html);
  } catch (err) {
    req.log.error(err);
    res.status(200).set('Content-Type', 'text/html').send(indexPage);
  }
});

app.use((_, res) => res.status(405).send());

module.exports = app;
