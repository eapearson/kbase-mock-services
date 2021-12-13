import {isJSONArray, isJSONObject, isJSONValue, toJSONObject, toJSONValue} from "./json.ts";
import {assert, assertThrows} from "https://deno.land/std@0.114.0/testing/asserts.ts";

// These should be valid JSON-compatible objects
const GOOD_JSON_OBJECTS = [
    {},
    {"foo": "bar"},
    {"foo": 1},
    {"foo": true},
    {"foo": false},
    {"foo": {"bar": "baz"}},
    {"foo": [1]}
]

const BAD_JSON_OBJECT_VALUES = [
    "foo", 1, true, false, null, [], new Date()
]

// These should be invalid JSON-compatible objects
const BAD_JSON_OBJECTS = [
    {"foo": undefined},
    {"foo": new Date()}
]


const GOOD_JSON_ARRAYS = [
    [],
    ["foo"],
    [1],
    [1.23],
    [true],
    [false],
    [null],
    [[]],
    [{}]
]

const BAD_JSON_ARRAY_VALUES = [
    "foo", 1, 1.23, true, false, null, new Date(), undefined
]

const BAD_JSON_ARRAYS = [
    [new Date()], [undefined]
]

const GOOD_JSON_VALUES = ["foo", 1, 1.23, true, false, null,
    [], {},]

const BAD_JSON_VALUES = [
    undefined, new Date(), Symbol(),
]

// isJSONObject

Deno.test('isJSONObject happy paths', () => {
    for (const goodValue of GOOD_JSON_OBJECTS) {
        assert(isJSONObject(goodValue) === true);
    }
})

Deno.test('isJSONObject sad paths', () => {
    for (const badValue of BAD_JSON_OBJECT_VALUES) {
        assert(isJSONObject(badValue) === false);
    }
    for (const badValue of BAD_JSON_OBJECTS) {
        assert(isJSONObject(badValue) === false);
    }
})

// isJSONArray

Deno.test('isJSONArray happy paths', () => {
    for (const goodValue of GOOD_JSON_ARRAYS) {
        assert(isJSONArray(goodValue) === true);
    }
})

Deno.test('isJSONArray sad paths', () => {
    for (const badValue of BAD_JSON_ARRAY_VALUES) {
        assert(isJSONObject(badValue) === false);
    }
    for (const badValue of BAD_JSON_ARRAYS) {
        assert(isJSONObject(badValue) === false);
    }
})

// isJSONValue

Deno.test('isJSONValue happy paths', () => {
    for (const goodValue of GOOD_JSON_VALUES) {
        assert(isJSONValue(goodValue) === true);
    }
})

Deno.test('isJSONValue sad paths', () => {
    for (const badValue of BAD_JSON_VALUES) {
        assert(isJSONValue(badValue) === false);
    }
})

// any compatible Javascript value to a JSONValue, if possible

Deno.test('toJSONValue happy paths', () => {
    for (const goodValue of GOOD_JSON_VALUES) {
        assert(isJSONValue(toJSONValue(goodValue)) === true);
    }

    for (const goodValue of GOOD_JSON_ARRAYS) {
        assert(isJSONValue(toJSONValue(goodValue)) === true);
    }

    for (const goodValue of GOOD_JSON_OBJECTS) {
        assert(isJSONValue(toJSONValue(goodValue)) === true);
    }
})

Deno.test('toJSONValue sad paths', () => {
    for (const badValue of BAD_JSON_VALUES) {
        assertThrows(() => {
            toJSONValue(badValue)

        }, Error);
    }

    for (const badValue of BAD_JSON_ARRAYS) {
        assertThrows(() => {
            toJSONValue(badValue)

        }, Error);
    }

    for (const badValue of BAD_JSON_OBJECTS) {
        assertThrows(() => {
            toJSONValue(badValue)

        }, Error);
    }
})

// toJSONObject

Deno.test('toJSONObject happy paths', () => {
    for (const value of GOOD_JSON_OBJECTS) {
        assert(toJSONObject(value));
    }
})

Deno.test('toJSONObject sad paths', () => {
    for (const value of BAD_JSON_OBJECTS) {
        assertThrows(() => {
            toJSONObject(value);
        });
    }
})
