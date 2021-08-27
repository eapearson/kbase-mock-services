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
