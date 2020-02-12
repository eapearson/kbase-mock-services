import { GenericClient } from '@kbase/ui-lib';

export interface GetServiceStatusParams {
    module_name: string;
    version?: string;
}

export interface GetServiceStatusResult {
    git_commit_hash: string;
    hash: string;
    health: string;
    module_name: string;
    status: string;
    up: number;
    url: string;
    version: string;
    release_tags: Array<string>;
}

export interface ServiceWizardAPIParams {
    upstreamURL: string;
    token: string;
}

export default class ServiceWizardAPI {
    params: ServiceWizardAPIParams;
    constructor(params: ServiceWizardAPIParams) {
        this.params = params;
    }
    handle(method: string, params: any) {
        switch (method) {
            case 'get_service_status':
                return this.getServiceStatus(params);
            default:
                throw new Error('Method ' + method + ' not supported');
        }
    }
    async callUpstreamService(module_name: string, version?: string): Promise<GetServiceStatusResult> {
        const client = new GenericClient({
            url: this.params.upstreamURL,
            token: this.params.token,
            module: 'ServiceWizard'
        });

        try {
            const [result] = await client.callFunc<[GetServiceStatusParams], [GetServiceStatusResult]>('get_service_status', [{
                module_name, version
            }]);
            return result;
        } catch (ex) {
            console.error('ERROR', ex);
            return Promise.reject(ex);
        }
    }
    async getServiceStatus([{ module_name, version }]: [GetServiceStatusParams]): Promise<GetServiceStatusResult> {
        switch (module_name) {
            // case 'xOntologyAPI':
            //     return Promise.resolve({
            //         git_commit_hash: 'fake',
            //         hash: 'fake',
            //         health: 'healthy',
            //         module_name: 'OntologyAPI',
            //         status: 'active',
            //         up: 1,
            //         url: 'http://localhost:3001/dynserv/instance/OntologyAPI',
            //         version: '0.0.1',
            //         release_tags: ['dev']
            //     });
            case 'JobBrowserBFF':
                return Promise.resolve({
                    git_commit_hash: 'fake',
                    hash: 'fake',
                    health: 'healthy',
                    module_name: 'JobBrowserBFF',
                    status: 'active',
                    up: 1,
                    url: 'http://localhost:3000/dynserv/internal/JobBrowserBFF',
                    version: '0.0.1',
                    release_tags: ['dev']
                });
            default:
                // TODO: this should call the real service wizard.
                console.log('calling upstream...', module_name, version);
                const upstreamResult = await this.callUpstreamService(module_name, version);
                // throw new Error('Unsupported service module: ' + module_name);
                return upstreamResult;
        }

    }
}
