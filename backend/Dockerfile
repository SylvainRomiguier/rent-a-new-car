FROM node:slim AS build
WORKDIR /app
COPY ./backend/package*.json ./
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
RUN pnpm install
COPY ./backend .
RUN pnpm build

FROM node:lts-alpine
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start;"]
