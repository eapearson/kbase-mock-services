import ModuleMethod from "../../../base/jsonrpc11/ModuleMethod.ts";

export interface Params {
}

export type Result = null;

export class InternalError extends ModuleMethod<Params, Result> {
    validateParams(possibleParams: [any]): Params {
        if (possibleParams.length > 0) {
            throw this.errorInvalidParamCount(0, possibleParams.length);
        }
        return {
        };
    }
    callFunc(params: Params): Promise<Result> {
        // The point of this method is to always throw an internal error, so the
        // result doesn't really matter.
        throw this.errorInternal();
    }
}