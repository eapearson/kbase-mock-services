import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import { JSONValue } from "/json.ts";
import { FieldGroups } from "../../types/FieldGroups.ts";

export interface GetFieldGroupsResult {
    groups: FieldGroups;
}

export type GetFieldGroupsParams = [];

export type GetFieldGroupsResults = [GetFieldGroupsResult];

export async function getJSON(): Promise<JSONValue> {
    const dataDir = new URL('../../../../data/sampleservice', import.meta.url).pathname;
    const path = `${dataDir}/groups/groups.json`;
    const resultData = JSON.parse(await Deno.readTextFile(path));
    return (resultData as unknown) as JSONValue;
}

export class GetFieldGroups extends ModuleMethod<GetFieldGroupsParams, GetFieldGroupsResults> {
    validateParams(possibleParams: Array<any>): GetFieldGroupsParams {
        return (possibleParams as unknown) as GetFieldGroupsParams;
    }

    async callFunc(params: GetFieldGroupsParams): Promise<GetFieldGroupsResults> {
        const groups = (await getJSON() as unknown) as FieldGroups;

        return [{ groups }];
    }
}