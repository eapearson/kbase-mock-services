/**
 * A method with no result will actually return null, not null wrapped in an 
 * array, just null. That non-wrapping is handled by ServiceHandler.
 */

import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
    foo: string;
}

export type Result = null;

export class NoResult extends ModuleMethod<Params, Result> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/FloatParam/params',
        type: 'object',
        required: ['foo'],
        properties: {
            foo: {
                type: 'string'
            }
        }
    };
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/FloatParam/result',
        type: 'null',
    };
    // validateParams(possibleParams: [any]): Params {
    //     if (possibleParams.length > 0) {
    //         throw this.errorInvalidParamCount(0, possibleParams.length);
    //     }
    //     return {
    //     };
    // }
    async callFunc(params: Params): Promise<Result> {
        return null;
    }
}