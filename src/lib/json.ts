export type JSONScalarValue = string | number | boolean | null;

export type JSONValue = JSONScalarValue | JSONObject | JSONArray;

export interface JSONObjectOf<T extends JSONValue> {
    [x: string]: T;
}

export type JSONObject = JSONObjectOf<JSONValue>;

export interface JSONArrayOf<T extends JSONValue> extends Array<T> {
}

export type JSONArray = JSONArrayOf<JSONValue>;

// deno-lint-ignore no-explicit-any
export function isJSONObject(value: any): value is JSONObject {
    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (value.constructor !== {}.constructor) {
        return false;
    }
    return !Object.keys(value).some((key) => {
        return !isJSONValue(value[key]);
    });
}

// deno-lint-ignore no-explicit-any
export function isJSONArray(value: any): value is JSONArray {
    if (!Array.isArray(value)) {
        return false;
    }
    return !value.some((subvalue) => {
        return !isJSONValue(subvalue);
    });
}

// deno-lint-ignore no-explicit-any
export function isJSONValue(value: any): value is JSONValue {
    const typeOf = typeof value;
    if (['string', 'number', 'boolean'].indexOf(typeOf) >= 0) {
        return true;
    }

    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return true;
    }
    if (isJSONArray(value)) {
        return true;
    }
    if (isJSONObject(value)) {
        return true;
    }

    return false;
}

// deno-lint-ignore no-explicit-any
export function toJSONObject(value: any): JSONObject {
    if (isJSONObject(value)) {
        return value as unknown as JSONObject;
    }
    throw new Error('Vaue is not a valid JSONObject');
}

// deno-lint-ignore no-explicit-any
export function toJSONValue(value: any): JSONValue {
    switch (typeof value) {
        case 'string':
            return value;
        case 'number':
            return value;
        case 'boolean':
            return value;
        case 'object':
            if (value === null) {
                return value;
            }
            if (Array.isArray(value)) {
                return value.map((item) => {
                    return toJSONValue(item);
                });
            }
            if (value.constructor === {}.constructor) {
                const x: JSONObject = {};
                for (const [k, v] of Object.entries(value)) {
                    if (typeof k !== 'undefined') {
                        x[k] = toJSONValue(v);
                    }
                }
                return x;
            }
    }
    throw new Error('Cannot be converted to JSONValue');
}
