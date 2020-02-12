
export type JSONScalar = number | string | boolean | null;

export type JSONValue = JSONScalar | JSONObject | JSONArray;

// NB: the usave of interace to define an array type might seem weird
// (it does to me!), but this form allows for circular or recursive
// type references like this.
export interface JSONArray extends Array<JSONValue> { };

export interface JSONObject {
    [key: string]: JSONValue;
}
