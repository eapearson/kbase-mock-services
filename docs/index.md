# KBase Mock Services

## Purpose

To provide a small world of kbase services in service of testing, prototyping, and development.

## Design

It is a real web server.

It supports all KBase api styles - JSON-RPC 1.1, JSON-RPC 2.0, REST.

It is statically typed.

It has optional jsonschema validation.

This ensures your mock data is pretty much in correct form.

Either handcraft data, or install data from an environment, e.g. CI.

Entity style operations (get-x, get-xs, create-x, update-x, delete-x) should be supportable automatically.

Search or more advanced operations which support a db may require custom code, or usage of a local database like sqlite.


## Quick Start

Start the server:

```shell
deno run --unstable --allow-net --allow-read  --import-map import_map.json src/index.ts --data-dir out
```

Talk to supported services at 

```text
http://localhost:3333
```

E.g. 

```shell
http://localhost:3333/services/sampleservice
```

And a full request:

```shell
curl -X POST http://localhost:3333/services/sampleservice \
    -H 'Authorization: MYTOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
"id": "123",
"version": "1.1",
"method": "SampleService.get_sample",
"params": [{
"id": "5cdb2854-b194-4644-a4c6-6ff2ed24b9c8", "version": 1
}]
}'
```


deno run --unstable --allow-net --allow-read  --import-map import_map.json src/index.ts --data-dir `pwd`/out
