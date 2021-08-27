import ModuleMethod from "../../../base/jsonrpc20/ModuleMethod";
import ModuleMethodNoParams from "../../../base/jsonrpc20/ModuleMethodNoParams";

export type Params = void;

export type Result = {
    greeting: string;
};

export class NoParams extends ModuleMethodNoParams<Result> {
    static resultSchema = {
        $id: 'https://kbase.us/schemas/services/jsonrpc20/NoParam/result',
        type: 'object',
        required: ['status'],
        properties: {
            greeting: {
                type: 'string'
            }
        }
    };

    async callFunc(): Promise<Result> {
        return {
            greeting: 'Hi!'
        };
    }
}