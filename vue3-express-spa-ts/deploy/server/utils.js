const fs = require('fs');
const etag = require('etag');
const path = require('path');

const frontendClientPath = path.resolve(__dirname, './dist/frontend');
const indexPage = fs.readFileSync(path.join(frontendClientPath, 'index.html'), 'utf-8');
const indexEtag = etag(indexPage, { weak: true });

module.exports = {
  frontendClientPath,
  indexPage,
  indexEtag,
};
