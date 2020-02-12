import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";

export interface Params {
}

export type Result = {
    greeting: string;
};

export class NoParams extends ModuleMethod<Params, Result> {
    validateParams(possibleParams: [any]): Params {
        if (possibleParams.length > 0) {
            throw this.errorInvalidParamCount(0, possibleParams.length);
        }
        return {
        };
    }
    async callFunc(params: Params): Promise<Result> {
        return {
            greeting: 'Hi!'
        };
    }
}