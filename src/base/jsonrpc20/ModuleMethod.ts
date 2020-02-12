import { JSONObject, JSONArray, JSONValue } from '../../types/json';
import { JSONRPC2Exception } from './types';
import AJV from 'ajv';



export interface ModuleMethodInput {
    params: MethodParams;
    token: string | null;
}

export type MethodParams = JSONObject | JSONArray;

export default abstract class ModuleMethod<T, R> {
    protected static paramsSchema?: any;
    protected static resultSchema?: any;
    protected validateParams?(possibleParams: MethodParams): T;
    validator?: AJV.Ajv;

    inputParams: MethodParams;
    token: string | null;

    constructor({ params, token }: ModuleMethodInput) {
        this.inputParams = params;
        this.token = token;
        if (!this.validateParams) {
            const paramsSchema = (this.constructor as typeof ModuleMethod).paramsSchema;
            const resultSchema = (this.constructor as typeof ModuleMethod).resultSchema;
            if (paramsSchema && resultSchema) {
                this.validator = new AJV({
                    allErrors: true
                });
                console.log('adding params schema', paramsSchema);
                this.validator.addSchema(paramsSchema, 'paramsSchema');
                this.validator.addSchema(resultSchema, 'resultSchema');
            } else {
                throw new Error('params and result schema must both be specified');
            }
        }
    }
    errorInvalidParams(errorText: string) {
        return new JSONRPC2Exception({
            message: `Invalid params`,
            code: -32602,
            name: 'JSONRPCError',
            data: {
                validationMessage: errorText
            }
        });
    }
    errorMissingParam(paramName: string) {
        return new JSONRPC2Exception({
            message: `Invalid params - missing param ${paramName}`,
            code: -32602,
            name: 'JSONRPCError',
            data: {

            }
        });
    }
    errorInvalidParamCount(countShouldBe: number, countIs: number) {
        return new JSONRPC2Exception({
            message: `Invalid param count, should be ${countShouldBe}, but is ${countIs}`,
            code: -32602,
            name: 'JSONRPCError'
        });
    }
    errorWrongParamType(name: string, expectedType: string, actualType: string) {
        return new JSONRPC2Exception({
            message: `Invalid param type, ${name} should be ${expectedType}, but is ${actualType}`,
            code: -32602,
            name: 'JSONRPCError'
        });
    }
    errorInternal(message: string) {
        return new JSONRPC2Exception({
            message: `Internal Error`,
            code: -32603,
            name: 'JSONRPCError',
            data: {
                message
            }
        });
    }
    errorMethodNotFound() {
        return new JSONRPC2Exception({
            message: `Method Not Found`,
            code: -32601,
            name: 'JSONRPCError'
        });
    }
    checkParamCount(expectedCount: number) {
        if (this.inputParams.length !== expectedCount) {
            throw new JSONRPC2Exception({
                code: -32602,
                name: 'JSONRPCError',
                message: `Invalid params - wrong number of params, should be ${expectedCount}, is ${this.inputParams.length}`
            });
        }
    }
    errorParamsNotArray(actualType: string) {
        return new JSONRPC2Exception({
            message: `Invalid params - should be Array, but is not (${actualType})`,
            code: -32602,
            name: 'JSONRPCError'
        });
    }
    ensureObject(possibleObject: JSONValue): JSONObject {
        if (typeof possibleObject !== 'object') {
            throw new JSONRPC2Exception({
                code: -32602,
                name: 'JSONRPCError',
                message: `Invalid params - expected object received ${typeof possibleObject}`
            });
        }
        if (possibleObject === null) {
            throw new JSONRPC2Exception({
                code: -32602,
                name: 'JSONRPCError',
                message: `Invalid params - unexpected null params`
            });
        }
        if ('pop' in possibleObject) {
            throw new JSONRPC2Exception({
                code: -32602,
                name: 'JSONRPCError',
                message: `Invalid params - unexpected array params`
            });
        }
        return possibleObject;
    }

    private checkParams(): T {
        // const check1 = this.checkParamCount();
        // We can check now that it is an array.
        const params = this.inputParams;
        console.log('validating???');
        if (this.validator) {
            console.log('validating...');
            if (this.validator.validate('paramsSchema', params)) {
                console.log('validated!');
                return (params as unknown) as T;
            } else {
                throw this.errorInvalidParams(this.validator.errorsText());
            }
        } else {
            if (this.validateParams) {
                return this.validateParams(params);
            } else {
                return (params as unknown) as T;
            }
        }
    }

    protected validateStringParam(params: JSONObject, key: string): string {
        if (!(key in params)) {
            throw this.errorMissingParam(key);
        }
        const value = params[key];
        if (typeof value !== 'string') {
            throw this.errorWrongParamType(key, 'string', typeof value);
        }
        return value;
    }

    protected validateIntegerParam(params: JSONObject, key: string): number {
        if (!(key in params)) {
            throw this.errorMissingParam(key);
        }
        const value = params[key];
        if (typeof value !== 'number') {
            throw this.errorWrongParamType(key, 'int', typeof value);
        }
        if (!Number.isInteger(value)) {
            throw new JSONRPC2Exception({
                message: `Invalid numeric value '${value}', not an integer`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        if (Number.isNaN(value) || !Number.isFinite(value) || !Number.isSafeInteger(value)) {
            throw new JSONRPC2Exception({
                message: `Invalid numeric value '${value}'`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        return value;
    }

    protected validateFloatParam(params: JSONObject, key: string): number {
        if (!(key in params)) {
            throw this.errorMissingParam(key);
        }
        const value = params[key];
        if (typeof value !== 'number') {
            throw this.errorWrongParamType(key, 'float', typeof value);
        }
        if (Number.isNaN(value) || !Number.isFinite(value) || !Number.isSafeInteger(value)) {
            throw new JSONRPC2Exception({
                message: `Invalid numeric value '${value}'`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        return value;
    }

    protected validateBooleanParam(params: JSONObject, key: string): number {
        if (!(key in params)) {
            throw this.errorMissingParam(key);
        }
        const value = params[key];
        if (typeof value !== 'number') {
            throw this.errorWrongParamType(key, 'bool (0 or 1)', typeof value);
        }
        if (!Number.isInteger(value)) {
            throw new JSONRPC2Exception({
                message: `Invalid boolean value, '${value}' must be an integer`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        if (Number.isNaN(value) || !Number.isFinite(value) || !Number.isSafeInteger(value)) {
            throw new JSONRPC2Exception({
                message: `Invalid boolean, must be an an integer of value 1 or 0, given '${value}'`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        if (value !== 0 && value !== 1) {
            throw new JSONRPC2Exception({
                message: `Invalid boolean value, '${value}' must be '0' (false) or '1' (true)`,
                code: -32602,
                name: 'JSONRPCError'
            });
        }
        return value;
    }


    protected async abstract callFunc(params: T): Promise<R>;

    async run(): Promise<R> {
        const params = this.checkParams();
        return this.callFunc(params);
    }
}