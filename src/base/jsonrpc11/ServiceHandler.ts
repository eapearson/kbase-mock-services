import { JSONValue } from "/types/json.ts";
import { Opine, Request, Response } from "https://deno.land/x/opine@1.9.0/mod.ts";
import { readAll } from "https://deno.land/std@0.114.0/io/util.ts";

// import { Router, Request, Response } from "express.ts";
import { ServiceWrapper } from "./ServiceWrapper.ts";
import { JSONRPC11Exception, JSONRPC11Request, JSONRPC11Response, JSONRPC11Error } from "./types.ts";

export default class ServiceHandler<HandlerClass extends ServiceWrapper> {
    app: Opine;
    id?: string;
    version?: string;
    // method: string;
    path: string;
    module: string;
    handler: HandlerClass;
    constructor({ app, path, module, handler }: { app: Opine, path: string, module: string, handler: HandlerClass; }) {
        this.app = app;
        this.path = path;
        this.module = module;
        this.handler = handler;
    }
    errorEmptyBody() {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Parse error',
            error: 'No data received - possibly wrong content type. Best is application/json, but text/plain is fine too.'
        });
    }
    errorEmptyID() {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - missing id',
            error: ''
        });
    }
    errorIdWrongType(type: string) {
        return new JSONRPC11Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `JSON RPC "id" property is not a "string", rather it is a "${type}"`,
            error: null
        });
    }
    errorEmptyVersion() {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - missing version'
        });
    }
    errorWrongVersion(badVersion: string | null) {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - incorrect version',
            error: {
                badVersion
            }
        });
    }
    errorInvalidVersion(badVersion: JSONValue) {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - invalid version type',
            error: {
                badVersion
            }
        });
    }
    errorMethodMissing() {
        return new JSONRPC11Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: 'JSON RPC method property is not defined',
            error: null
        });
    }
    errorMethodWrongType(type: string) {
        return new JSONRPC11Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `JSON RPC "method" property is not a "string", rather it is a "${type}"`,
            error: null
        });
    }
    errorParamsMissing() {
        return new JSONRPC11Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: 'JSON RPC params property is not defined',
            error: null
        });
    }
    errorParamsNotArray() {
        return new JSONRPC11Exception({
            code: -32700,
            name: 'JSONRPCError',
            message: 'Parse error (cannot deserialize ...)',
            error: 'some\nlong\nstack\trace'
        });
    }
    errorWrongModule(wrongMethod: string) {
        return new JSONRPC11Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `Method [${wrongMethod}] is not a valid method name for asynchronous job execution`,
            error: 'some\nlong\nstack\trace'
        });
    }
    errorParse(message: string) {
        return new JSONRPC11Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Parse error',
            error: message
        });
    }
    extractRequest(request: JSONValue): JSONRPC11Request {
        if (typeof request !== 'object' || request === null || 'pop' in request) {
            throw new JSONRPC11Exception({
                code: -32600,
                name: 'JSONRPCError',
                message: 'JSONRPC body not object',
                error: ''
            });
        }
        if (!request.hasOwnProperty('id')) {
            // Not caught by the real service.
            // TODO: maybe simulate the real service here?
            // TODO: when we abstract this out, maybe make the behavior,
            // that is wht it checks, configurable...
            throw this.errorEmptyID();
        }

        if (typeof request.id !== 'string') {
            throw this.errorIdWrongType(typeof request.method);
        }

        if (!('version' in request)) {
            // This also not caught by real service.
            throw this.errorEmptyVersion();
        }

        if (typeof request.version !== 'string') {
            throw this.errorInvalidVersion(request.version);
        }

        if (request.version !== '1.1') {
            // This not caught either.
            throw this.errorWrongVersion(request.version);
        }

        if (!('method' in request)) {
            throw this.errorMethodMissing();
        }

        if (typeof request.method !== 'string') {
            throw this.errorMethodWrongType(typeof request.method);
        }

        if (!('params' in request)) {
            throw this.errorParamsMissing();
        }

        if (!(request.params instanceof Array)) {
            // TODO: upstream problem - it should detect this specifically
            // instead of throwing a gnarly internal parsing error. For one,
            // it is not a good error message to propagate; for two, it
            // can be confused with a jsonrpc parse error which would be for
            // invalid javascript.
            throw this.errorParamsNotArray();
        }

        // TODO: common sense validation of the request structure and values.

        return {
            id: request.id,
            version: request.version,
            method: request.method,
            params: request.params
        };
    }
    async handle(request: Request, response: Response) {
        let rpcResponse: JSONRPC11Response;

        // let id, version, method, params;

        try {
            // Header Stuff
            const token = request.get('authorization') || null;

            // Body Stuff

            if (!request.body) {
                this.errorEmptyBody();
            }
            const requestBody = await (async () => {
                try {
                    const raw = await readAll(request.body);
                    const text = new TextDecoder().decode(raw);
                    return JSON.parse(text) as JSONValue;
                } catch (ex) {
                    console.error(`hmm: ${request.body}`);
                    throw this.errorParse(ex.message);
                }
            })();

            const { id, version, method, params } = this.extractRequest(requestBody);

            this.id = id;

            const [moduleName, functionName] = method.split('.');

            if (moduleName !== this.module) {
                // TODO: The actual detection of this is less fine grained. It flags it as
                // a bad method name (which it technically is, but still) rather than a
                // bad module name. There is also no need to include a stack trace since the error
                // can be made perfectly understandable as it is.
                throw this.errorWrongModule(moduleName);
            }

            // TODO: rework catching and throwing errors ... as it is, all errors will have
            // a null id.
            const result = await this.handler.handle({
                method: functionName,
                params,
                token
            });

            // TODO: We need to handle one special case here. For some inexeplicable
            // reason our jsonrpc methods can return a plain null value, violation
            // the otherwise rule that result is always an array, and our result value
            // is always the first element.

            rpcResponse = {
                id, version, result
            };
        } catch (ex) {
            // let trace: string | null;
            let error: JSONRPC11Error;
            response.status = 500;
            if (ex instanceof JSONRPC11Exception) {
                // trace = null;
                error = ex.toJSON();
            } else if (ex instanceof Error) {

                const trace = (() => {
                    if (typeof ex.stack === 'undefined') {
                        return null;
                    }
                    return ex.stack.split('\n');
                })();
                error = {
                    code: -32500,
                    name: 'JSONRPCError',
                    message: ex.message,
                    error: {
                        trace
                    }
                };
            } else {
                error = {
                    code: -32500,
                    name: 'JSONRPCError',
                    message: String(ex),
                    error: null
                };
            }

            rpcResponse = {
                id: this.id || null,
                version: '1.1',
                error
            };
        }

        response.set('content-type', 'application/json');
        response.send(JSON.stringify(rpcResponse));
    }
    start() {
        this.app.route(this.path).post(this.handle.bind(this));
    }
}
