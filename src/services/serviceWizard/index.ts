import { ServiceWrapper, HandleProps, ServiceWrapperParams } from '../../base/jsonrpc11/ServiceWrapper.ts';
import { GetServiceStatus } from './methods/GetServiceStatus.ts';
import { JSONRPC11Exception } from '../../base/jsonrpc11/types.ts';
import { JSONArrayOf, JSONValue } from "../../lib/json.ts";

export interface ServiceWizardParams extends ServiceWrapperParams {
    upstreamURL: string;
}

export default class ServiceWizard extends ServiceWrapper {
    upstreamURL: string;
    constructor(params: ServiceWizardParams) {
        super(params);
        this.upstreamURL = params.upstreamURL;
    }
    handle({ method, params, token }: HandleProps): Promise<JSONArrayOf<JSONValue>> {
        switch (method) {
            case 'get_service_status':
                return new GetServiceStatus({
                    params, token, dataDir: this.dataDir, timeout: this. timeout
                }).run();
            default:
                throw new JSONRPC11Exception({
                    message: `Cannot find method ${method}`,
                    code: -32601,
                    name: 'JSONRPCError'
                });
        }
    }
}
