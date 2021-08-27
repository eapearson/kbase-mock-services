import {
    JSONObject, JSONArray,
} from '../../types/json';
import AJV from 'ajv';

export interface ModuleMethodInput {
    params?: MethodParams;
    token?: string;
}

export type MethodParams = JSONObject | JSONArray;

export default abstract class ModuleMethodNoParams<ResultType> {
    protected static resultSchema?: any;
    validator?: AJV.Ajv;

    inputParams?: MethodParams;
    token?: string;

    constructor({ params, token }: ModuleMethodInput) {
        this.inputParams = params;
        this.token = token;

        const resultSchema = (this.constructor as typeof ModuleMethodNoParams).resultSchema;
        if (resultSchema) {
            this.validator = new AJV({
                allErrors: true
            });
            this.validator.addSchema(resultSchema, 'resultSchema');
        } else {
            throw new Error('result schema must both be specified');
        }

    }

    protected async abstract callFunc(): Promise<ResultType>;

    async run(): Promise<ResultType> {
        return this.callFunc();
    }
}