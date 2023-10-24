#!/bin/bash
set -ex

FUS() {
  rm -rf ./src/backend/dist/ ./src/frontend/dist/ ./src/frontend/dist-ssr/
  rm -rf ./deploy/server/dist/
  rm -rf ./deploy/aws-lambda/cdk.out/
}

RO() {
  npm --prefix ./src/backend run build
  npm --prefix ./src/frontend run build
}

DAH() {
  rm -rf ./deploy/server/dist
  mkdir ./deploy/server/dist

  cp -R src/backend/dist deploy/server/dist/backend
  #cp src/backend/package.json src/backend/package-lock.json deploy/server/dist/backend/

  cp -R src/frontend/dist deploy/server/dist/frontend
  cp -R src/frontend/dist-ssr deploy/server/dist/frontend-ssr
  cp src/frontend/package.json src/frontend/package-lock.json deploy/server/dist/frontend-ssr/

  #npm --prefix ./deploy/server/dist/backend ci --omit=dev
  npm --prefix ./deploy/server/dist/frontend-ssr ci --omit=dev
}

case "$1" in
  "before") FUS ;;
  "after") DAH ;;
  *) FUS; RO; DAH ;;
esac
