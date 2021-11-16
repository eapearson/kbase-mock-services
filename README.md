# KBase Mock Services

These mock services are here to assist in ui testing.

They cover several use cases:

- development: direct mimicking of existing or upcoming kbase core services, to allow ui development against a local version of the service.
- same for dynamic services
- a mini service wizard which can proxy requests to the upstream dynamic service or return a url for a mocked dyanmic service
- testing mocks for each type of service:
  - jsonrpc 1.1
  - jsonrpc 2.0
  - REST

## Examples

### Run directly 

```bash
deno run --unstable --allow-net --allow-read  --import-map import_map.json src/index.ts --port 4444 --data-dir `pwd`/datasets/examples/SampleService
```

### Create image

```bash
docker build --tag mocker .
```

### Run container

```bash
docker run -v "$(pwd)/datasets/SampleService:/data" -p 3333:3333 --net kbase-dev  --name mocker --rm mocker
```

## TODO

- running container should be exitable with Ctrl-C
- add docker compose examples


export DATASET_PATH=`pwd`/datasets/SampleService
docker compose up