import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
    foo: number;
}

export type Result = {
    status: string;
};

export class IntegerParam extends ModuleMethod<Params, Result> {
    static paramsSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/IntegerParam/params',
        type: 'object',
        required: ['foo'],
        properties: {
            foo: {
                type: 'integer',
                minimum: 0,
                maximum: 100,
                title: 'Foo',
                description: 'A Foo value is an integer between 0 and 100 '
            }
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
    // validateParams(paramsArray: Array<any>): Params {
    //     this.checkParamCount(1);

    //     const [possibleParams] = paramsArray;

    //     const params = this.ensureObject(possibleParams);

    //     const foo = this.validateIntegerParam(params, 'foo');

    //     return { foo };
    // }
    async callFunc(params: Params): Promise<Result> {
        return {
            status: 'OK'
        };
    }
}