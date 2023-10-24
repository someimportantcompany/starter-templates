const crypto = require('crypto');

const jsonpCallbackName = 'c416ce30';

/**
 * @param {import("express").Application} app
 * @returns {void}
 */
function configureExpress(app) {
  app.set('etag', false);
  app.set('jsonp callback name', jsonpCallbackName);
  app.set('query parser', 'extended');
  app.set('strict routing', false);
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
}

/**
 * @param {import("bunyan").Logger} logger
 */
function configureMiddleware(logger) {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns {void}
   */
  return function loggerMiddleware(req, res, next) {
    // Disable jsonp support for this full-stack application
    // eslint-disable-next-line no-unused-expressions
    req.query && req.query[jsonpCallbackName] && (delete req.query[jsonpCallbackName]);

    // And a little vanity touch
    res.set('X-Powered-By', 'vue3-express-ssr-ts');

    const reqId = crypto.randomUUID();
    req.log = logger.child({ reqId });
    res.set('X-Request-ID', reqId);
    // Enable debug logs when specifically requested for this instance of the logger
    if (req.get('X-Logger-Debug')) req.log.level(20);
    res.on('finish', () => req.log.info({ req, res }));

    next();
  }
}

/**
 * @param {import("express").Request} req
 * @returns {import("../../src/frontend/entry-server").ServerReqContext}
 */
function createServerReqContext(req) {
  return {
    origin: `${req.protocol}://${req.hostname === 'localhost' ? req.get('host') : req.hostname}`,
    url: req.url,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent') || 'unknown',
  }
}

/**
 * @param {string} template
 * @param {ReturnType<import("../../src/frontend/entry-server").render>} params
 * @returns {string}
 */
function renderTemplate(template, { appHtml, headTags }) {
  let html = template.toString();

  Object.entries(headTags).forEach(([ key, value ]) => {
    html = html.replace(`<!--${key}-->`, value);
  });

  html = html.replace('<!--app-html-->', appHtml);

  return html;
}

module.exports = {
  configureExpress,
  configureMiddleware,
  createServerReqContext,
  renderTemplate,
};
