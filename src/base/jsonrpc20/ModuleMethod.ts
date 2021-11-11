import { JSONObject, JSONArray, JSONValue } from '../../types/json.ts';
import { JSONRPC2Exception } from './types.ts';
import AJV from 'ajv';

export interface ModuleMethodInput {
    params: MethodParams;
    token?: string;
}

export type MethodParams = JSONObject | JSONArray;

export default abstract class ModuleMethod<ParamType, ResultType> {
    protected static paramsSchema: any;
    protected static resultSchema: any;
    // protected validateParams?(possibleParams: MethodParams): ParamType;
    validator: AJV.Ajv;

    inputParams: MethodParams;
    token?: string;

    constructor({ params, token }: ModuleMethodInput) {
        this.inputParams = params;
        this.token = token;

        const paramsSchema = (this.constructor as typeof ModuleMethod).paramsSchema;
        const resultSchema = (this.constructor as typeof ModuleMethod).resultSchema;

        this.validator = new AJV({
            allErrors: true
        });
        this.validator.addSchema(paramsSchema, 'paramsSchema');
        this.validator.addSchema(resultSchema, 'resultSchema');
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
    // checkParamCount(expectedCount: number) {
    //     if (this.inputParams.length !== expectedCount) {
    //         throw new JSONRPC2Exception({
    //             code: -32602,
    //             name: 'JSONRPCError',
    //             message: `Invalid params - wrong number of params, should be ${expectedCount}, is ${this.inputParams.length}`
    //         });
    //     }
    // }
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

    private checkParams(): ParamType {
        // const check1 = this.checkParamCount();
        // We can check now that it is an array.
        const params = this.inputParams;

        if (this.validator.validate('paramsSchema', params)) {
            return (params as unknown) as ParamType;
        } else {
            throw this.errorInvalidParams(this.validator.errorsText());
        }

    }

    protected async abstract callFunc(params: ParamType): Promise<ResultType>;

    async run(): Promise<ResultType> {
        const params = this.checkParams();
        return this.callFunc(params);
    }
}