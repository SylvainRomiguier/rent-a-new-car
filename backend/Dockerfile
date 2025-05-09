FROM node:lts-alpine AS build
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
RUN npm run build

FROM node:lts-alpine
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start;"]
