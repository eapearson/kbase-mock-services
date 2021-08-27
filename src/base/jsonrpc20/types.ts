import { JSONValue } from "../../types/json";

export interface JSONRPC2Request {
    id: string;
    jsonrpc: '2.0';
    method: string;
    params?: JSONValue;
}

export interface JSONRPC2Result {
    id: string | null;
    jsonrpc: '2.0';
    result: JSONValue;
}

export interface JSONRPC2Error {
    code: number;
    message: string;
    data?: string | number | object;
}

export interface JSONRPC2ErrorResult {
    id: string | null;
    jsonrpc: '2.0';
    error: JSONRPC2Error;
}

export type JSONRPC2Response = JSONRPC2Result | JSONRPC2ErrorResult;


interface JSONRPC2ExceptionParam extends JSONRPC2Error {
    name: string;
}

export class JSONRPC2Exception extends Error {
    code: number;
    name: string;
    data?: string | number | object;
    constructor(param: JSONRPC2ExceptionParam) {
        super(param.message);
        this.code = param.code;
        this.name = param.name;
        this.data = param.data;
    }
    toJSON(): JSONRPC2Error {
        return {
            code: this.code,
            message: this.message,
            data: this.data
        };
    }
}
