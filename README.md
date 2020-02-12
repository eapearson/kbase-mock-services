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


