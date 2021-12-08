import { JSONArray } from "../../json.ts";

export interface HandleProps {
    method: string;
    params: JSONArray;
    token: string | null;
}

export interface ServiceWrapperParams {
    dataDir: string;
    timeout: number;
}

export abstract class ServiceWrapper {
    dataDir: string;
    timeout: number;
    constructor(params: ServiceWrapperParams) {
        this.dataDir = params.dataDir;
        this.timeout = params.timeout;
    }
    abstract handle(props: HandleProps): Promise<JSONArray>;
    // abstract addMockHappy(params: JSONValue, result: any): void;
    // abstract addMockSad(params: JSONValue, error: JSONRPC11Error): void;
}
