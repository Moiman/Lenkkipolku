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

RUN apk add --no-cache nodejs npm
RUN npm ci --omit=dev

ARG PORT
ARG PG_HOST
ARG PG_PORT
ARG PG_USERNAME
ARG PG_PASSWORD
ARG PG_DATABASE
ARG SECRET
ARG REFRESH_SECRET

ENV PORT=${PORT}
ENV PG_HOST=${PG_HOST}
ENV PG_PORT=${PG_PORT}
ENV PG_USERNAME=${PG_USERNAME}
ENV PG_PASSWORD=${PG_PASSWORD}
ENV PG_DATABASE=${PG_DATABASE}
ENV SECRET=${SECRET}
ENV REFRESH_SECRET=${REFRESH_SECRET}

EXPOSE 3000
CMD ["npm", "start"]
