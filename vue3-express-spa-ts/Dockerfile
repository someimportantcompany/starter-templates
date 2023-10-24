FROM node:18 as build
WORKDIR /app
COPY ./package*.json ./

COPY ./src/backend/package*.json ./src/backend/
COPY ./src/frontend/package*.json ./src/frontend/
COPY ./deploy/dev/package*.json ./deploy/dev/
COPY ./deploy/server/package*.json ./deploy/server/
COPY ./deploy/aws-lambda/package*.json ./deploy/aws-lambda/

COPY ./*.sh .
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY --from=build /app/package.json ./
COPY --from=build /app/deploy/ ./deploy

ENV HTTP_HOST "0.0.0.0"

ENTRYPOINT ["/usr/local/bin/npm"]

