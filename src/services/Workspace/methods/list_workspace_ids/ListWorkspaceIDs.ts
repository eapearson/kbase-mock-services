import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import {JSONObject} from "/json.ts";
import {getJSON} from "/lib/utils.ts";

export type Tokens = {[key: string]: string}

export interface ListWorkspaceIDsParam extends JSONObject {
    perm: string;
    excludeGlobal: number;
    onlyGlobal: number;
}

export type ListWorkspaceIDsParams = [ListWorkspaceIDsParam];

export interface ListWorkspaceIDsResult extends JSONObject {
    workspaces: Array<number>;
    pub: Array<number>;
}

export type ListWorkspaceIDsResults= [ListWorkspaceIDsResult];

export class ListWorkspaceIDs extends ModuleMethod<ListWorkspaceIDsParams, ListWorkspaceIDsResults> {
    validateParams(possibleParams: Array<any>): ListWorkspaceIDsParams {
        return (possibleParams as unknown) as ListWorkspaceIDsParams;
    }

    async callFunc(params: ListWorkspaceIDsParams): Promise<ListWorkspaceIDsResults> {
        const tokens = (await getJSON(this.dataDir, 'Workspace', 'tokens')) as unknown as Tokens;
        const username = (() => {
            if (this.token === null) {
                return null;
            }
            const username = tokens[this.token];
            if (!username) {
                return null;
            } return username;
        })();
        let fileName: string;
        if (username === null) {
            fileName = `list_workspace_ids-anonymous`;
        } else {
            fileName = `list_workspace_ids-user-${username}`;
        }
         
        
        const result = (await getJSON(this.dataDir, 'Workspace', fileName)) as unknown as ListWorkspaceIDsResult;
        return [result];
    }
}
