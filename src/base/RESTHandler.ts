import { JSONValue } from '/types/json.ts';
import { Opine, Request, Response } from 'https://deno.land/x/opine@1.9.0/mod.ts';
// import { readAll } from "https://deno.land/std@0.103.0/io/util.ts";

// import { Router, Request, Response } from "express.ts";
// import { ServiceWrapper } from "./ServiceWrapper.ts";
// import { JSONRPC11Exception, JSONRPC11Request, JSONRPC11Response, JSONRPC11Error } from "./types.ts";

export interface RESTHandleProps {
    method: string;
    path: string;
    query: { [key: string]: string };
    token: string | null;
    body: JSONValue;
}

export interface RESTHandlerParams {
    dataDir: string;
}

export abstract class RESTHandler {
    dataDir: string;
    constructor(params: RESTHandlerParams) {
        this.dataDir = params.dataDir;
    }
    abstract handle(props: RESTHandleProps): Promise<JSONValue>;
}

export default class RESTService {
    app: Opine;
    path: string | RegExp;
    module: string;
    handler: RESTHandler;
    constructor({
        app,
        path,
        module,
        handler,
    }: {
        app: Opine;
        path: string | RegExp;
        module: string;
        handler: RESTHandler;
    }) {
        this.app = app;
        this.path = path;
        this.module = module;
        this.handler = handler;
    }

    async handle(request: Request, response: Response) {
        let rpcResponse: JSONValue;

        // let id, version, method, params;

        try {
            // Header Stuff
            const token = request.get('authorization') || null;

            // The path after the initial API mount path will be the
            // param named "0".
            const path = request.params['0'];

            // const path = request.

            //  if (!request.body) {
            //     this.errorEmptyBody();
            // }
            // const requestBody = await (async () => {
            //     try {
            //         const raw = await readAll(request.body);
            //         const text = new TextDecoder().decode(raw);
            //         return JSON.parse(text) as JSONValue;
            //     } catch (ex) {
            //         console.error(`hmm: ${request.body}`);
            //         throw this.errorParse(ex.message);
            //     }
            // })();

            // A REST request may handle based on several attributes:
            // method
            // url (path)
            // query
            // content-type
            // accept
            //
            // But realistically, just method and url.
            const result = await this.handler.handle({
                method: request.method,
                path,
                query: request.query,
                token,
                body: request.body,
            });

            rpcResponse = result;
        } catch (ex) {
            rpcResponse = {
                message: ex.message,
            };
        }

        response.set('content-type', 'application/json');
        response.send(JSON.stringify(rpcResponse));
    }
    start() {
        this.app.route(this.path).all(this.handle.bind(this));
    }
}
