export interface HandleProps {
    method: string;
    params: any;
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
    abstract handle(props: HandleProps): Promise<any>;
    // abstract addMockHappy(params: JSONValue, result: any): void;
    // abstract addMockSad(params: JSONValue, error: JSONRPC11Error): void;
}
