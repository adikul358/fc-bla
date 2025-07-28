FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile
COPY . .

ENV NODE_ENV=production

ENTRYPOINT [ "bun", "start" ]