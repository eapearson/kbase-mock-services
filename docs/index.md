# KBase Mock Services

## Purpose

To provide a small world of kbase services in service of testing, prototyping, and development.

## Design

It is a real web server.

It supports all KBase api styles - JSON-RPC 1.1, JSON-RPC 2.0, REST.

It is statically typed; implemented in Typescript, running with the Deno runtime.

It has optional jsonschema validation.

This ensures your mock data is pretty much in correct form.

Either handcraft data, or install data from an environment, e.g. CI.

CRUD style operations (get-x, get-xs, create-x, update-x, delete-x) are easily supported; with limits.

Search or more advanced operations which support a db may require more complex code, and possibly usage of a local database like sqlite.

## Quick Start

Start the server:

```shell
deno run --unstable --allow-net --allow-read  --import-map import_map.json --watch src/index.ts --port 4444 --data-dir /some/dir
```

Talk to supported services at:

```text
http://localhost:4444
```

E.g. 

```shell
http://localhost:4444/services/sampleservice
```

And a full request:

```shell
curl -X POST http://localhost:4444/services/sampleservice \
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
