const fs = require('fs');
const etag = require('etag');
const path = require('path');

const frontendClientPath = path.resolve(__dirname, './dist/frontend');
const frontendSsrPath = path.resolve(__dirname, './dist/frontend-ssr');
const indexPage = fs.readFileSync(path.join(frontendClientPath, 'index.html'), 'utf-8');
const indexEtag = etag(indexPage, { weak: true });
const manifest = JSON.parse(fs.readFileSync(path.join(frontendClientPath, '.vite/ssr-manifest.json'), 'utf-8'));
const frontendSsr = import(path.join(frontendSsrPath, 'entry-server.mjs'));

module.exports = {
  frontendClientPath,
  frontendSsrPath,
  indexPage,
  indexEtag,
  manifest,
  frontendSsr,
};
