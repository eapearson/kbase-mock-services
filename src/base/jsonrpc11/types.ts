import { JSONValue } from "../../types/json";

export interface JSONRPC11Request {
    id: string;
    version: '1.1';
    method: string;
    params: Array<JSONValue>;
}

export interface JSONRPC11Result {
    id: string | null;
    version: '1.1';
    result: Array<JSONValue> | null;
}

export interface JSONRPC11Error {
    code: number;
    name: string;
    message: string;
    error?: string | null;
}

export interface JSONRPC11ErrorResult {
    id: string | null;
    version: '1.1';
    error: JSONRPC11Error;
}

export type JSONRPC11Response = JSONRPC11Result | JSONRPC11ErrorResult;

interface JSONRPC11ExceptionParam {
    code: number;
    name: string;
    message: string;
    error?: string | null;
}

export class JSONRPC11Exception extends Error {
    code: number;
    name: string;
    error?: string | null;
    constructor(param: JSONRPC11ExceptionParam) {
        super(param.message);
        this.code = param.code;
        this.name = param.name;
        this.error = param.error;
    }
    toJSON(): JSONRPC11Error {
        return {
            code: this.code,
            name: this.name,
            message: this.message,
            error: this.error
        };
    }
}
