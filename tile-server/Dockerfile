FROM alpine:3.19 AS builder
WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY package*.json ./
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN npm ci
RUN npm run build


FROM alpine:3.19 AS final
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ./package*.json ./
COPY ./public ./public
COPY ./data ./data

RUN apk add --no-cache nodejs npm
RUN npm ci --omit=dev

ARG PORT

ENV PORT=${PORT}

EXPOSE ${PORT}
CMD ["npm", "start"]
