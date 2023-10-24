#!/bin/bash
set -ex

npm --prefix ./src/backend ci
npm --prefix ./src/frontend ci

npm --prefix ./deploy/dev ci || true
npm --prefix ./deploy/server ci
npm --prefix ./deploy/aws-lambda ci
