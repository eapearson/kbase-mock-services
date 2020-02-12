import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
    foo: number;
}

export type Result = {
    status: string;
};

export class BooleanParam extends ModuleMethod<Params, Result> {
    validateParams(paramsArray: Array<any>): Params {
        this.checkParamCount(1);

        const [possibleParams] = paramsArray;

        const params = this.ensureObject(possibleParams);

        const foo = this.validateBooleanParam(params, 'foo');

        return { foo };
    }
    async callFunc(params: Params): Promise<Result> {
        return {
            status: 'OK'
        };
    }
}