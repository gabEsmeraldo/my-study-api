FROM node:22-alpine AS base
WORKDIR /usr/app
RUN npm install -g npm@11

FROM base AS deps
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /usr/app
ENV NODE_ENV=production

COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist

RUN mkdir -p /usr/app/storage && chown -R node:node /usr/app
USER node

EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "dist/main"]