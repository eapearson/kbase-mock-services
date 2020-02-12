import { JSONValue } from "../../types/json";
import { Router, Request, Response } from "express";
import { ServiceWrapper } from "./ServiceWrapper";
import {
    JSONRPC2Exception, JSONRPC2Request, JSONRPC2Response, JSONRPC2Error
} from "./types";

export class ServiceHandler<HandlerClass extends ServiceWrapper> {
    app: Router;
    id?: string;
    version?: string;
    method: string;
    path: string;
    module: string;
    handler: HandlerClass;
    constructor({ app, path, module, handler }: { app: Router, path: string, module: string, handler: HandlerClass; }) {
        this.app = app;
        this.path = path;
        this.module = module;
        this.handler = handler;
    }
    errorEmptyBody() {
        return new JSONRPC2Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Parse error',
            data: {
                description: 'No data received - possibly wrong content type. Best is application/json, but text/plain is fine too.'
            }
        });
    }
    errorEmptyID() {
        return new JSONRPC2Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - missing id'
        });
    }
    errorIdWrongType(type: string) {
        return new JSONRPC2Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `JSON RPC "id" property is not a "string", rather it is a "${type}"`
        });
    }
    errorEmptyVersion() {
        return new JSONRPC2Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - incorrect or missing version'
        });
    }
    errorWrongVersion() {
        return new JSONRPC2Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Invalid request - incorrect or missing version'
        });
    }
    errorMethodMissing() {
        return new JSONRPC2Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: 'JSON RPC method property is not defined'
        });
    }
    errorMethodWrongType(type: string) {
        return new JSONRPC2Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `JSON RPC "method" property is not a "string", rather it is a "${type}"`
        });
    }
    errorParamsMissing() {
        return new JSONRPC2Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: 'JSON RPC params property is not defined'
        });
    }
    errorParamsWrongTopLevelType() {
        return new JSONRPC2Exception({
            code: -32700,
            name: 'JSONRPCError',
            message: 'Parse error (params must be object or array.)'
        });
    }
    errorWrongModule(wrongMethod: string) {
        return new JSONRPC2Exception({
            code: -32601,
            name: 'JSONRPCError',
            message: `Method [${wrongMethod}] is not a valid method name for asynchronous job execution`
        });
    }
    errorParse(message: string) {
        return new JSONRPC2Exception({
            code: -32600,
            name: 'JSONRPCError',
            message: 'Parse error',
            data: {
                originalMessage: message
            }
        });
    }
    extractRequest(request: JSONValue): JSONRPC2Request {
        if (typeof request !== 'object' || request === null || 'pop' in request) {
            throw new JSONRPC2Exception({
                code: -32600,
                name: 'JSONRPCError',
                message: 'JSONRPC body not object'
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

        if (!request.hasOwnProperty('jsonrpc')) {
            // This also not caught by real service.
            throw this.errorEmptyVersion();
        }

        if (request.jsonrpc !== '2.0') {
            // This not caught either.
            throw this.errorWrongVersion();
        }

        if (!request.hasOwnProperty('method')) {
            throw this.errorMethodMissing();
        }

        if (typeof request.method !== 'string') {
            throw this.errorMethodWrongType(typeof request.method);
        }

        if (!request.hasOwnProperty('params')) {
            throw this.errorParamsMissing();
        }

        if (!(request.params instanceof Array ||
            (typeof request.params === 'object' && request.params instanceof ({}).constructor))) {
            // TODO: upstream problem - it should detect this specifically
            // instead of throwing a gnarly internal parsing error. For one,
            // it is not a good error message to propagate; for two, it 
            // can be confused with a jsonrpc parse error which would be for
            // invalid javascript.
            throw this.errorParamsWrongTopLevelType();
        }

        // TODO: common sense validation of the request structure and values.

        return {
            id: request.id,
            jsonrpc: request.jsonrpc,
            method: request.method,
            params: request.params
        };
    }
    async handle(request: Request, response: Response) {
        let rpcResponse: JSONRPC2Response;

        // let id, version, method, params;

        try {
            // Header Stuff
            const token = request.headers.authorization || null;

            // Body Stuff
            let requestBody: any;
            if (!request.body) {
                this.errorEmptyBody();
            }
            try {
                requestBody = JSON.parse(request.body);
            } catch (ex) {
                throw this.errorParse(ex.message);
            }

            const { id, jsonrpc, method, params } = this.extractRequest(requestBody);

            console.log('jsonrpc 2.0:', id, jsonrpc, method, params);

            const [moduleName, functionName] = method.split('.');

            if (moduleName !== this.module) {
                // TODO: The actual detection of this is less fine grained. It flags it as
                // a bad method name (which it technically is, but still) rather than a 
                // bad module name. There is also no need to include a stack trace since the error
                // can be made perfectly understandable as it is.
                throw this.errorWrongModule(request.method);
            }

            // const api = new NarrativeJobService();
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
                id, jsonrpc,
                result: result === null ? result : [result]
            };
        } catch (ex) {
            let trace: string | null;
            let error: JSONRPC2Error;
            response.statusCode = 500;
            if (ex instanceof JSONRPC2Exception) {
                trace = null;
                error = ex.toJSON();
            } else if (ex instanceof Error) {
                trace = ex.stack || null;
                error = {
                    code: -32500,
                    message: ex.message,
                    data: {
                        trace
                    }
                };
            } else {
                trace = null;
                error = {
                    code: -32500,
                    message: String(ex)
                };
            }

            rpcResponse = {
                id: this.id || null,
                jsonrpc: '2.0',
                error
            };
        }

        response.setHeader('content-type', 'application/json');
        response.send(JSON.stringify(rpcResponse));
    }
    start() {
        this.app.route(this.path).post(this.handle.bind(this));
    }
}
