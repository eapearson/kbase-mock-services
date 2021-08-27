import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface NormalParams {
    foo: string;
}

export type NormalResult = {
    status: string;
};

export class Normal extends ModuleMethod<NormalParams, NormalResult> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/StringParam/params',
        type: 'object',
        required: ['foo'],
        additionalProperties: false,
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
        additionalProperties: false,
        properties: {
            status: {
                type: 'string'
            }
        }
    };
    async callFunc(params: NormalParams): Promise<NormalResult> {
        return {
            status: 'OK'
        };
    }
}