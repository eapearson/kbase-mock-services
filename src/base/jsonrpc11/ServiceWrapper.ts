export interface HandleProps {
    method: string;
    params: any;
    token: string | null;
}

export abstract class ServiceWrapper {
    async abstract handle(props: HandleProps): Promise<any>;
    // abstract addMockHappy(params: JSONValue, result: any): void;
    // abstract addMockSad(params: JSONValue, error: JSONRPC11Error): void;
}
