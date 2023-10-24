const fs = require('fs');
const etag = require('etag');
const path = require('path');

const frontendClientPath = path.resolve(__dirname, './dist/frontend');
const frontendSsrPath = path.resolve(__dirname, './dist/frontend-ssr');

let indexPage;
try {
  indexPage = fs.readFileSync(path.join(frontendClientPath, 'index.html'), 'utf-8');
} catch (err) {
  err.message = `Error fetching frontend/client/index.html: ${err.message}`;
  throw err;
}

let indexEtag;
try {
  indexEtag = etag(indexPage, { weak: true });
} catch (err) {
  err.message = `Error calculating frontend/client/index.html: ${err.message}`;
  throw err;
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(frontendClientPath, '.vite/ssr-manifest.json'), 'utf-8'));
} catch (err) {
  err.message = `Error fetching frontend/client/.vite/ssr-manifest.json: ${err.message}`;
  throw err;
}

let frontendSsr;
try {
  fs.statSync(path.join(frontendSsrPath, 'entry-server.mjs'));
  frontendSsr = import(path.join(frontendSsrPath, 'entry-server.mjs'));
} catch (err) {
  err.message = `Error fetching frontend/server/entry-server.mjs: ${err.message}`;
  throw err;
}

module.exports = {
  frontendClientPath,
  frontendSsrPath,
  indexPage,
  indexEtag,
  manifest,
  frontendSsr,
};
