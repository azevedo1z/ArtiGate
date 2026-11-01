FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY backend-api/package.json backend-api/package.json
COPY frontend/package.json frontend/package.json
COPY backend-api-e2e/package.json backend-api-e2e/package.json
COPY packages/ packages/
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npx nx build backend-api --configuration=production
RUN cp -a node_modules/.prisma /tmp/prisma-client \
    && npm prune --omit=dev --legacy-peer-deps \
    && mkdir -p node_modules/.prisma \
    && cp -a /tmp/prisma-client/. node_modules/.prisma/

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/backend-api/dist ./backend-api/dist
RUN mkdir -p /app/uploads/articles && chown -R node:node /app/uploads

USER node
EXPOSE 3000
CMD ["node", "backend-api/dist/main.js"]
