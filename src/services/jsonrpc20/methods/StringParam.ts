import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
    foo: string;
}

export type Result = {
    status: string;
};

export class StringParam extends ModuleMethod<Params, Result> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/StringParam/params',
        type: 'object',
        required: ['foo'],
        properties: {
            foo: {
                type: 'string'
            }
        }
    };
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/StringParam/result',
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string'
            }
        }
    };

    async callFunc(params: Params): Promise<Result> {
        return {
            status: 'OK'
        };
    }
}