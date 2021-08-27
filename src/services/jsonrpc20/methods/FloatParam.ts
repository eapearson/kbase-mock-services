import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
    foo: number;
}

export type Result = {
    status: string;
};

export class FloatParam extends ModuleMethod<Params, Result> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/FloatParam/params',
        type: 'object',
        required: ['foo'],
        properties: {
            foo: {
                type: 'number'
            }
        }
    };
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/FloatParam/result',
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string'
            }
        }
    };
    // validateParams(paramsArray: Array<any>): Params {
    //     this.checkParamCount(1);

    //     const [possibleParams] = paramsArray;

    //     const params = this.ensureObject(possibleParams);

    //     const foo = this.validateFloatParam(params, 'foo');

    //     return { foo };
    // }
    async callFunc(params: Params): Promise<Result> {
        return {
            status: 'OK'
        };
    }
}