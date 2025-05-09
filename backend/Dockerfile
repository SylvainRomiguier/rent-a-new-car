FROM node:slim AS build
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install -g pnpm@latest
RUN pnpm install
COPY ./backend .
RUN pnpm build

FROM node:lts-alpine
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start;"]
