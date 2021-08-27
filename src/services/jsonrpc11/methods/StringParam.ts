import ModuleMethod from "../../../base/jsonrpc11/ModuleMethod.ts";

export interface Params {
    foo: string;
}

export type Result = {
    status: string;
};

export class StringParam extends ModuleMethod<Params, Result> {
    validateParams(paramsArray: Array<any>): Params {
        this.checkParamCount(1);

        const [possibleParams] = paramsArray;

        const params = this.ensureObject(possibleParams);

        const foo = this.validateStringParam(params, 'foo');

        return { foo };
    }
    callFunc(params: Params): Promise<Result> {
        return Promise.resolve({
            status: 'OK'
        });
    }
}