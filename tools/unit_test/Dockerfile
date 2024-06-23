FROM denoland/deno:1.16.4

LABEL org.opencontainers.image.source=https://github.com/eapearson/kbase-mock-services

# see https://hub.docker.com/r/denoland/deno

EXPOSE 3333

WORKDIR /app

USER deno

COPY . .

RUN deno cache --unstable --import-map import_map.json src/index.ts

ENTRYPOINT ["sh"]

CMD ["scripts/run-unit-tests.sh"]
