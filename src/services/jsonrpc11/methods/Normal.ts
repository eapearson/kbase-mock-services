import ModuleMethod from "../../../base/jsonrpc11/ModuleMethod";

export interface NormalParams {
    foo: string;
}

export type NormalResult = {
    bar: string;
};

export class Normal extends ModuleMethod<NormalParams, NormalResult> {
    validateParams(possibleParams: [any]): NormalParams {
        if (possibleParams.length !== 1) {
            throw this.errorInvalidParamCount(1, possibleParams.length);
        }
        const [possibleParm] = possibleParams;
        const param = this.ensureObject(possibleParm);

        if (!('foo' in param)) {
            throw this.errorMissingParam('foo');
        }
        const foo = param['foo'];
        if (typeof foo !== 'string') {
            throw this.errorWrongParamType('foo', 'string', typeof foo);
        }
        return {
            foo
        };
    }
    async callFunc(params: NormalParams): Promise<NormalResult> {
        return {
            bar: 'Hi!'
        };
    }
}