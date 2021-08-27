import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import { JSONObject } from "/types/json.ts";
import { SDKBoolean, Username } from "../../../common.ts";
import { getJSON } from "/lib/utils.ts";
import { SampleId } from "../../types/Sample.ts";


export interface GetSampleACLsParam extends JSONObject {
    id: SampleId;
    "as_admin": SDKBoolean;
}

export type GetSampleACLsParams = [GetSampleACLsParam];

export interface SampleACLs extends JSONObject {
    owner: Username;
    admin: Array<Username>;
    write: Array<Username>;
    read: Array<Username>;
}

export type GetSampleACLsResult = SampleACLs;

export type GetSampleACLsResults = [GetSampleACLsResult];
export class GetSampleACLs extends ModuleMethod<GetSampleACLsParams, GetSampleACLsResults> {
    validateParams(possibleParams: Array<any>): GetSampleACLsParams {
        return (possibleParams as unknown) as GetSampleACLsParams;
    }

    async callFunc(params: GetSampleACLsParams): Promise<GetSampleACLsResults> {
        const fileName = `sample_acl_${params[0].id}`;
        const data = (await getJSON(this.dataDir, 'SampleService', fileName) as unknown) as GetSampleACLsResult;
        return [data];
    }
}