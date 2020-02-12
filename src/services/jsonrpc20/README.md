# JSONRPC 2.0 Test Service

This is KBase's legacy JSONRPC implementation.

Cases to handle

- JSONRPC
  - x simple param and result
  - x no params
  - x no result
  - param types
    - good
      - x string
      - x integer (number)
      - x float (number)
      - x boolean (number)
      - array
      - object
      - null
    - bad
      - boolean (JSON boolean is not supported)
      - complex params
        - tests can poke at params to trigger invalid params error
        - this should be based on jsonschema to make validation sane...
  - error conditions:
    - invalid params:
      - id
        - missing
        - wrong type:
          - object
          - array
      - version
        - missing
        - wrong type
          - number
          - null
          - array
          - object
        - wrong value
          - string but not 1.1
      - method
        - missing
        - wrong type
        - wrong format
          - no method
          - too many dots?
      - params
        - missing
        - wrong type
          - object
          - null
          - number
          - string
    - internal error
    - module not found
    - method not found
- Non-JSONRPC
  - http method not supported
  - internal error