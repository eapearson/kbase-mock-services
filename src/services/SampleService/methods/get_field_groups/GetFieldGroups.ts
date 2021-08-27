import ModuleMethod from '/base/jsonrpc11/ModuleMethod.ts';
import { FieldGroups } from '../../types/FieldGroups.ts';
import { getJSON } from '../../../../lib/utils.ts';

export interface GetFieldGroupsResult {
    groups: FieldGroups;
}

export type GetFieldGroupsParams = [];

export type GetFieldGroupsResults = [GetFieldGroupsResult];

// export async function getJSON(): Promise<JSONValue> {
//     const dataDir = new URL('../../../../data/sampleservice', import.meta.url).pathname;
//     const path = `${dataDir}/groups/groups.json`;
//     const resultData = JSON.parse(await Deno.readTextFile(path));
//     return (resultData as unknown) as JSONValue;
// }

export class GetFieldGroups extends ModuleMethod<GetFieldGroupsParams, GetFieldGroupsResults> {
    groups: FieldGroups | null = null;
    validateParams(possibleParams: Array<any>): GetFieldGroupsParams {
        return possibleParams as unknown as GetFieldGroupsParams;
    }

    async getGroups() {
        if (this.groups === null) {
            this.groups = (await getJSON(this.dataDir, 'SampleService', 'groups')) as unknown as FieldGroups;
        }
        return this.groups;
    }

    async callFunc(params: GetFieldGroupsParams): Promise<GetFieldGroupsResults> {
        const groups = (await this.getGroups()) as unknown as FieldGroups;

        return [{ groups }];
    }
}
