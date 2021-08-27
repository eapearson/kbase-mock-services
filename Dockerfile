FROM denoland/deno:1.13.1

# see https://hub.docker.com/r/denoland/deno

EXPOSE 3333 

WORKDIR /app

USER deno

COPY . .

RUN deno cache --unstable --import-map import_map.json src/index.ts

CMD ["run",  "--unstable", "--allow-net", "--allow-read",  "--import-map", "import_map.json", "src/index.ts", "--data-dir", "/data"]
