import ModuleMethod from "../../../../base/jsonrpc11/ModuleMethod.ts";
import {JSONRPC11Exception} from "../../../../base/jsonrpc11/types.ts";
import {JSONObject} from "../../../../lib/json.ts";
import {ObjectInfo, ObjectSpecification} from "../common.ts";
import {getJSON} from "../../../../lib/utils.ts";


export interface GetObjectInfo3Param {
    objects: Array<ObjectSpecification>;
    includeMetadata?: number; // bool
    ignoreErrors?: number; // bool
}

export type GetObjectInfo3Params = [GetObjectInfo3Param];

export interface GetObjectInfo3Result extends JSONObject {
    infos: Array<ObjectInfo | null>;
    paths: Array<Array<string> | null>;
}

export type GetObjectInfo3Results = [GetObjectInfo3Result];

export class GetObjectInfo3 extends ModuleMethod<GetObjectInfo3Params, GetObjectInfo3Results> {
    validateParams(possibleParams: Array<any>): GetObjectInfo3Params {
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

        return (possibleParams as unknown) as GetObjectInfo3Params;
    }

    async callFunc(params: GetObjectInfo3Params): Promise<GetObjectInfo3Results> {
        // we only support the ref atm:
        if (params[0].objects.length === 0) {
            throw new JSONRPC11Exception({
                message: 'Invalid params - expected array of length 1',
                code: -32602,
                name: 'JSONRPCError',
                error: null
            });
        }

        const infos: Array<ObjectInfo> = [];
        const paths: Array<Array<string>> = [];
        await Promise.all(params[0].objects.map(async (objectSpecification: ObjectSpecification) => {
            if (!('ref' in objectSpecification)) {
                throw new JSONRPC11Exception({
                    message: 'Invalid params - "ref" not provided',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: null
                });
            }
            const upa = (objectSpecification.ref! as string);
            // We replace / with _ when an upa appears in a filename.
            const name = upa.replace(/\//g, '_');
            const filename = `object_info_${name}`;
            const {
                info,
                path
            } = (await getJSON(this.dataDir, 'Workspace', filename) as unknown) as { info: ObjectInfo, path: Array<string>; };
            infos.push(info);
            paths.push(path);
        }));

        // const objectSpecification: ObjectSpecification = (params[0].objects[0] as unknown) as ObjectSpecification;
        return [{infos, paths}];
    }
}
