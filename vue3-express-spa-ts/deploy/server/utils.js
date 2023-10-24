const fs = require('fs');
const etag = require('etag');
const path = require('path');

const frontendClientPath = path.resolve(__dirname, './dist/frontend');

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

module.exports = {
  frontendClientPath,
  indexPage,
  indexEtag,
};
