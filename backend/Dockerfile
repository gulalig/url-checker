FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM node:20-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]