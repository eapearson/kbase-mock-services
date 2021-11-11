import { JSONArray } from "../../json.ts";

export interface HandleProps {
    method: string;
    params: JSONArray;
    token: string | null;
}

export interface ServiceWrapperParams {
    dataDir: string;
}

export abstract class ServiceWrapper {
    dataDir: string;
    constructor(params: ServiceWrapperParams) {
        this.dataDir = params.dataDir;
    }
    abstract handle(props: HandleProps): Promise<JSONArray>;
    // abstract addMockHappy(params: JSONValue, result: any): void;
    // abstract addMockSad(params: JSONValue, error: JSONRPC11Error): void;
}
