/**
 * A method with no result will actually return null, not null wrapped in an
 * array, just null. That non-wrapping is handled by ServiceHandler.
 */

import ModuleMethod from "../../../base/jsonrpc11/ModuleMethod.ts";

export interface Params {
}

export type Result = null;

export class NoResult extends ModuleMethod<Params, Result> {
    validateParams(possibleParams: [any]): Params {
        if (possibleParams.length > 0) {
            throw this.errorInvalidParamCount(0, possibleParams.length);
        }
        return {
        };
    }
    callFunc(params: Params): Promise<Result> {
        return Promise.resolve(null);
    }
}