# KBase Mock Services

A mock server for KBase services.

Implemented in [Deno](https://deno.land), this project implements an http server which can provide mock endpoints for
KBase services using the JSON-RPC 1.1, JSON-RPC 2.0, or REST-like protocols.

It covers several use cases:

- development: direct mimicking of existing or upcoming kbase core services, to allow ui development against a local
  version of the service.
- same for dynamic services
- a mini service wizard which can proxy requests to the upstream dynamic service or return a url for a mocked dyanmic
  service
- testing mocks for each type of service:
    - JSON-RPC 1.1
    - JSON-RPC 2.0
    - REST-like

## Background

[ TO DO ]

## Examples

### Run directly

```bash
deno run --unstable --allow-net --allow-read  --watch src/index.ts --port 4444 --data-dir `pwd`/datasets/examples/SampleService
```

where

`deno run` is the Deno command to run an application

`--unstable` indicates we are using experimental features (Deno is young!)

`--allow-net` indicates Deno should be able to use network connections

`--allow-read` indicates Deno should be able to read files

`--import-map import_map.json` indicates Deno should use the import_map.json file

`--watch` indicates Deno should watch all source files for changes, and restart the server if so

`src/index.ts` is our server source file

all options after this are directed to `src/index.ts`:

`--port 4444` tells the mock server to listen on port 4444

``--data-dir `pwd`/datasets/examples/SampleService`` tells the mock server to use the provided directory as the source
of data for all mock services

### Create image

```bash
docker build --tag mocker .
```

### Run container

```bash
docker run -v "$(pwd)/datasets/SampleService:/data" -p 3333:3333 --net kbase-dev  --name mocker --rm mocker
```

```bash
export DATASET_PATH=`pwd`/datasets/examples/SampleService
docker compose up
```

or

```bash
DATASET_PATH=`pwd`/datasets/examples/SampleService docker compose up
```

## How it works

[ TO DO ]

## TODO

- running container should be exit-able with Ctrl-C
- add docker compose examples
