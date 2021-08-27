# Generating Data

In order for the mock services to be effective, they need to be populated with data.

When generating data, we need to be holistic. Since our services essentially form a loosely coupled database, we need to
generate a set of data together.

For instance, a workspace object may reference other objects, users, samples, apps, etc. If we mock a workspace object,
we probably need to mock the user profile, samples, sample acls, app specs, and so forth.

A script should be created for each service, which contains both a standalone cli data fetcher, as well as a library
interface. This allows a set of data fetching scripts to interact, fetching any nested dependencies as needed.

The common pattern for many services will be to store entities as:

```text
entitytype_ID.json
```

e.g.

```text
sample_5cdb2854-b194-4644-a4c6-6ff2ed24b9c8-1.json
```

where `sample_` is used as the prefix for this type of object, `5cdb2854-b194-4644-a4c6-6ff2ed24b9c8-1` is the full
sample identifier, with a `-` separating the sample id and the sample version.

Note that we want the `ID` to be an unambiguous, complete identifier. Each service will have a different way of forming
this. We do not want relative references which lack a version, if the object type is versioned. To mock fetching a
versioned resource without a version, all versions should be present and the service mock code should handle determine
the correct behavior, which is typically to return the most recent version.

Another example

```text
object_62462-29-1.json
```

Each service should have its own top level directory inside `data`. E.g. `data/workspace`, `data/samples`
, `data/userprofile`.

> TODO: perhaps the directory name should be the module name, unless it is a service without a module name.


Format of the file should be the original JSON-RPC `result` (or `error`, but that is to be worked on still). For certain
REST services without a JSON-RPC wrapper structure, the plain response can be stored.

The reasons to use the result rather than the entire response objects:

- the JSON-RPC protocol requires matching the id of request with response
- the wrapper does not change, other than id, from request to request
- bulk/batch/collection methods return multiple result items in an array; each item should be stored and the service
  mock should collect them together into the result array.

## Management

Generated data must not be checked into the repo.

Rather, if you wish to be able to incorporate a specific case of test data in to repo, check in a ... ??

## Examples

```bash
export TOKEN="MYTOKEN"
export REF="wsid/objid/ver"
deno run --unstable --allow-write --allow-read --allow-net --import-map=import_map.jsonsrc/cli/fetchSampleSet.ts --ref "$REF" --token "$TOKEN" --dest out

```

## TODO

- mocking errors?
