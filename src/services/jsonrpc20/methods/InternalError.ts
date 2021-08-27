import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
}

export type Result = null;

export class InternalError extends ModuleMethod<Params, Result> {
    // validateParams(possibleParams: [any]): Params {
    //     if (possibleParams.length > 0) {
    //         throw this.errorInvalidParamCount(0, possibleParams.length);
    //     }
    //     return {
    //     };
    // }
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/InteralError/params',
        type: 'object',
        required: [],
        properties: {

        }
    };
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/IntegerParam/result',
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string'
            }
        }
    };
    async callFunc(params: Params): Promise<Result> {
        // The point of this method is to always throw an internal error, so the
        // result doesn't really matter.
        throw this.errorInternal('An internal error');
    }
}