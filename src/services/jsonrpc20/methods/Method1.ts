import ModuleMethod, { MethodParams } from "../../../base/jsonrpc20/ModuleMethod";
import { JSONObject, JSONArray } from "../../../types/json";

export interface ObjParam {
    string_param: string;
    int_param: number;
    float_param: number;
    bool_param: number;
    null_param: null;
}

export interface Method1Params {
    string_param: string;
    int_param: number;
    float_param: number;
    bool_param: number;
    null_param: null;
    // string_array_param: Array<string>;
    // obj_param: ObjParam;
}

export type Method1Result = {
    string_result: string;
};

export class Method1 extends ModuleMethod<Method1Params, Method1Result> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/method1/params',
        type: 'object',
        required: ['string_param', 'int_param', 'float_param', 'bool_param', 'null_param'],
        properties: {
            string_param: {
                type: 'string'
            },
            int_param: {
                type: 'integer'
            },
            float_param: {
                type: 'number'
            },
            bool_param: {
                type: 'integer'
            },
            null_param: {
                type: 'null'
            }
        }
    };
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/method1/result',
        type: 'object',
        required: ['string_result'],
        properties: {
            string_result: {
                type: 'string'
            }
        }
    };
    // validateParams(possibleParams: MethodParams): Method1Params {
    //     // JSONRPC 2.0 params can be array or object, but we always use object?
    //     // TODO: is this true?
    //     const param = this.ensureObject(possibleParams);

    //     // Check the "string_param"
    //     if (!('foo' in param)) {
    //         throw this.errorMissingParam('foo');
    //     }
    //     const foo = param['foo'];
    //     if (typeof foo !== 'string') {
    //         throw this.errorWrongParamType('foo', 'string', typeof foo);
    //     }
    //     return {
    //         foo
    //     };
    // }
    async callFunc(params: Method1Params): Promise<Method1Result> {
        return {
            string_result: 'Hi!'
        };
    }
}