import { ServiceWrapper, HandleProps } from '../../base/jsonrpc11/ServiceWrapper';
import { GetServiceStatus } from './methods/GetServiceStatus';
import { JSONRPC11Exception } from '../../base/jsonrpc11/types';

export interface ServiceWizardParams {
    upstreamURL: string;
}

export default class ServiceWizard extends ServiceWrapper {
    upstreamURL: string;
    constructor(params: ServiceWizardParams) {
        super();
        this.upstreamURL = params.upstreamURL;
    }
    async handle({ method, params, token }: HandleProps): Promise<any> {
        switch (method) {
            case 'get_service_status':
                return new GetServiceStatus({ params, token, upstreamURL: this.upstreamURL }).run();
            default:
                throw new JSONRPC11Exception({
                    message: `Cannot find method ${method}`,
                    code: -32601,
                    name: 'JSONRPCError'
                });
        }
    }
}