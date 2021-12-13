import ModuleMethod from "../../../../base/jsonrpc11/ModuleMethod.ts";
import {JSONRPC11Exception} from "../../../../base/jsonrpc11/types.ts";
import {isJSONArray, JSONArrayOf, JSONObject} from "../../../../lib/json.ts";

const cwd = new URL('.', import.meta.url).pathname;
const resultData = JSON.parse(await Deno.readTextFile(`${cwd}data/status.json`));
const result = (resultData as unknown) as JSONObject;

export type StatusParams = [];

export type StatusResult = JSONArrayOf<JSONObject>;

export class Status extends ModuleMethod<StatusParams, StatusResult> {
    validateParams(possibleParams: Array<any>): StatusParams {
        if (!isJSONArray(possibleParams)) {
            throw new JSONRPC11Exception({
                message: 'Invalid params - expected array',
                code: -32602,
                name: 'JSONRPCError',
                error: null
            });
        }

        if (possibleParams.length !== 0) {
            throw new JSONRPC11Exception({
                message: 'Invalid params - expected array of length 0',
                code: -32602,
                name: 'JSONRPCError',
                error: null
            });
        }

        return (possibleParams as unknown) as StatusParams;
    }

    callFunc(_params: StatusParams): Promise<StatusResult> {
        return Promise.resolve([result]);
    }
}