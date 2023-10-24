#!/bin/bash
set -ex

FUS() {
  rm -rf ./src/backend/dist/ ./src/frontend/dist/
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
  #npm --prefix ./deploy/server/dist/backend ci --omit=dev
}

case "$1" in
  "before") FUS ;;
  "after") DAH ;;
  *) FUS; RO; DAH ;;
esac
