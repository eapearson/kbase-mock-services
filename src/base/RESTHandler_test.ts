import RESTService, {RESTHandleProps, RESTHandler} from "./RESTHandler.ts";
import opine, {Request, Response} from 'https://deno.land/x/opine@1.9.1/mod.ts';
import {assert} from "https://deno.land/std@0.114.0/_util/assert.ts";
import {JSONValue} from "../lib/json.ts";

class MyRESTService extends RESTService {
    async handle(request: Request, response: Response) {
        await new Promise((resolve) => {
            resolve(null);
        })
    }
}

class MyHandler extends RESTHandler {
    handle({method, path, query, token, body}: RESTHandleProps): Promise<JSONValue> {
        return new Promise<JSONValue>((resolve) => {
            resolve(null);
        });
    }
}

Deno.test('RESTHandler should instantiate', () => {
    const app = opine();
    const handler = new MyHandler({dataDir: 'foo'});
    assert(new MyRESTService({app, path: "/", module: "Foo", handler}));
})