import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import {JSONRPC11Exception} from "/base/jsonrpc11/types.ts";
import {JSONObject, JSONValue} from "/json.ts";
import {ObjectInfo, ObjectSpecification} from "../common.ts";
import {getJSON} from "/lib/utils.ts";


// export interface GetObjectInfo3Param {
//     objects: Array<ObjectSpecification>;
//     includeMetadata?: number; // bool
//     ignoreErrors?: number; // bool
// }

export interface AdminsterParam {
    command: string;
}

export type AdministerParams = [AdminsterParam];

// export interface GetObjectInfo3Result extends JSONObject {
//     infos: Array<ObjectInfo>;
//     paths: Array<Array<string>>;
// }

export type AdministerResults = [JSONValue];

export class Administer extends ModuleMethod<AdministerParams, AdministerResults> {
    validateParams(possibleParams: Array<any>): AdministerParams {
        // if (!isJSONArray(possibleParams)) {
        //     throw new JSONRPC11Exception({
        //         message: 'Invalid params - expected array',
        //         code: -32602,
        //         name: 'JSONRPCError',
        //         error: null
        //     });
        // }
        //
        // if (possibleParams.length !== 0) {
        //     throw new JSONRPC11Exception({
        //         message: 'Invalid params - expected array of length 0',
        //         code: -32602,
        //         name: 'JSONRPCError',
        //         error: null
        //     });
        // }

        return (possibleParams as unknown) as AdministerParams;
    }

    async callFunc(params: AdministerParams): Promise<AdministerResults> {
        

        switch (params[0].command) {
            case 'listModRequests':
                return await Promise.resolve([[]]);
            default:
                throw new JSONRPC11Exception({
                    message: 'Invalid params - "command" not recognized',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: {
                        command: params[0].command
                    }
                });
        }
    }
}
