FROM node:slim AS build
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install -g pnpm@latest
RUN pnpm install
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:slim AS deps
# Install production dependencies only
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install -g pnpm@latest
RUN pnpm install --prod

FROM node:slim
WORKDIR /home/node/app
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/core/server.js"]
