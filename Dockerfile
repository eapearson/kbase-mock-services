FROM denoland/deno:1.13.1

# see https://hub.docker.com/r/denoland/deno

# Default port - can we change it when running docker? surely yes...
EXPOSE 3333 

WORKDIR /app

USER deno

# COPY deps.ts .

COPY . .

RUN deno cache --unstable --import-map import_map.json src/index.ts

# ENTRYPOINT ["deno"]

CMD ["run",  "--unstable", "--allow-net", "--allow-read",  "--import-map", "import_map.json", "src/index.ts", "--data-dir", "/data"]
