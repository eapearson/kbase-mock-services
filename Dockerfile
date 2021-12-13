FROM denoland/deno:1.16.4

LABEL org.opencontainers.image.source=https://github.com/eapearson/kbase-mock-services

# see https://hub.docker.com/r/denoland/deno

EXPOSE 3333

WORKDIR /app

USER deno

COPY . .

RUN deno cache --unstable src/index.ts

CMD ["run",  "--unstable", "--allow-net", "--allow-read",  "src/index.ts", "--data-dir", "/data"]
