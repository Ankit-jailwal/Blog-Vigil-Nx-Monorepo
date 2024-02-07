FROM my-base-image:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npx nx build auth ${BUILD_FLAG}

FROM nx-image:nx-base

WORKDIR /app
COPY --from=builder /app/builder ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/auth/main.js"]