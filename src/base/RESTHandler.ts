import { JSONValue } from '/types/json.ts';
import { Opine, Request, Response } from 'https://deno.land/x/opine@1.9.1/mod.ts';

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

export class NotFoundError extends Error {
    status = 404;
    statusMessage = 'Not Found';
}

export class AppError extends Error {
    httpStatus: number;
    errorMessage: string;
    errorCode: number;
    httpStatusMessage: string;
    constructor(errorMessage: string, errorCode: number, httpStatus: number, httpStatusMessage: string) {
        super(`${errorCode} ${errorMessage}`);
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.httpStatusMessage = httpStatusMessage;
    }

    toJSON() {
        return {
            httpcode: this.httpStatus,
            httpstatus: this.httpStatusMessage,
            appcode: this.errorCode,
            apperror: this.errorMessage,
            message: this.message,
            callid: 'foo',
            time: Date.now()
        }
    }
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
            response.set('content-type', 'application/json');
            response.send(JSON.stringify(rpcResponse));
        } catch (ex) {
            if (ex instanceof NotFoundError) {
                response.setStatus(404);
                if (request.accepts('application/json')) {
                    rpcResponse = {
                        error: {
                            message: ex.message
                        }
                    }
                    response.set('content-type', 'application/json');
                    response.send(JSON.stringify(rpcResponse));
                } else {
                    response.set('content-type', 'text/plain');
                    response.send(ex.message);
                }
            } else if (ex instanceof AppError) {
                response.setStatus(400);
                rpcResponse = {
                    error: ex.toJSON()
                };
                response.set('content-type', 'application/json');
                response.send(JSON.stringify(rpcResponse));
            } else {
                response.setStatus(400);
                rpcResponse = {
                    error: {
                        message: ex.message,
                    }
                };
                response.set('content-type', 'application/json');
                response.send(JSON.stringify(rpcResponse));
            }
        }
    }
    start() {
        this.app.route(this.path).all(this.handle.bind(this));
    }
}
