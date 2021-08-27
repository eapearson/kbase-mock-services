import ModuleMethod from '/base/jsonrpc11/ModuleMethod.ts';
import { getJSON } from '/lib/utils.ts';

export interface ServiceStatus {
    state: string;
    message: string;
    version: string;
    git_url: string;
    git_commit_hash: string;
}

export type StatusParams = [];
export type StatusResult = [ServiceStatus];

// export async function getJSON(username: string): Promise<JSONValue> {
//     const dataDir = new URL('../../../../data/userprofile/generated', import.meta.url).pathname;
//     const path = `${dataDir}/user_profile_${username}.json`;
//     console.log('path', path);
//     const resultData = JSON.parse(await Deno.readTextFile(path));
//     return (resultData as unknown) as JSONValue;
// }

export class Status extends ModuleMethod<StatusParams, StatusResult> {
    validateParams(possibleParams: Array<any>): StatusParams {
        return possibleParams as unknown as StatusParams;
    }

    async callFunc(): Promise<StatusResult> {
        // we only support the ref atm:

        const fileName = `status`;
        const status = (await getJSON(this.dataDir, 'UserProfile', fileName)) as unknown as ServiceStatus;

        return [status];
    }
}
