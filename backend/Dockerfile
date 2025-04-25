FROM node:slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:current-alpine
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start;"]
