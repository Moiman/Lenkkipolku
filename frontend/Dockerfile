FROM alpine:3.18 AS builder
WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY . .

RUN npm ci
RUN npm run build


FROM alpine:3.18 AS final
WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN apk add --no-cache nodejs npm
RUN npm i vite

ARG FRONTEND_PORT

ENV FRONTEND_PORT=${FRONTEND_PORT}

EXPOSE ${FRONTEND_PORT}
CMD npm exec -- vite preview --host
