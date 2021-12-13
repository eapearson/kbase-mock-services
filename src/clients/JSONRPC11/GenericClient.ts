import {JSONArrayOf, JSONValue} from '../../lib/json.ts';
import { ServiceClient, ServiceClientParams } from './ServiceClient.ts';

export type GenericClientParams = JSONArrayOf<JSONValue>;
export type GenericClientResult = JSONArrayOf<JSONValue>;

export interface GenericClientConstructorParams extends ServiceClientParams {
    module: string;
}

export default class GenericClient extends ServiceClient {
    module = '';

    constructor(params: GenericClientConstructorParams) {
        super(params);
        this.module = params.module;
    }

    public async callMethod(method: string, params: GenericClientParams): Promise<GenericClientResult> {
        return await this.callFunc<GenericClientParams, GenericClientResult>(method, params);
    }
}
