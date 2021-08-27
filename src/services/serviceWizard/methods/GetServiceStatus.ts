import ModuleMethod, { ModuleMethodInput } from "../../../base/jsonrpc11/ModuleMethod.ts";
import { JSONArray } from "../../../types/json.ts";

export interface Params {
    "module_name": string;
    version?: string;
}

export interface Result {
    "git_commit_hash": string;
    hash: string;
    health: string;
    "module_name": string;
    status: string;
    up: number;
    url: string;
    version: string;
    "release_tags": Array<string>;
}

export interface GetServiceStatusArg extends ModuleMethodInput {
    // upstreamURL: string;
}

export class GetServiceStatus extends ModuleMethod<Params, Result> {
    // upstreamURL: string;
    constructor(arg: GetServiceStatusArg) {
        super(arg);
        // this.upstreamURL = arg.upstreamURL;
    }
    validateParams(paramsArray: JSONArray): Params {
        this.checkParamCount(1);

        const [possibleParams] = paramsArray;
        const params = this.ensureObject(possibleParams);

        const moduleName = this.validateStringParam(params, 'module_name');

        const result: Params = {
            "module_name": moduleName
        };

        if ('version' in params) {
            const version = this.validateStringParam(params, 'version');
            result.version = version;
        }

        return result;
    }
    // async callUpstreamService(module_name: string, version?: string): Promise<Result> {
    //     const client = new GenericClient({
    //         url: this.upstreamURL,
    //         token: this.token || undefined,
    //         module: 'ServiceWizard'
    //     });
    //
    //     try {
    //         const [result] = await client.callFunc<[Params], [Result]>('get_service_status', [{
    //             module_name, version
    //         }]);
    //         return result;
    //     } catch (ex) {
    //         console.error('ERROR', ex.message);
    //         return Promise.reject(ex);
    //     }
    // }
    // deno-lint-ignore camelcase
    callFunc({ module_name, version }: Params): Promise<Result> {
        console.log('service wizard', module_name, version);
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
                    // url: 'http://localhost:3000/dynserv/internal/JobBrowserBFF',
                    url: 'http://localhost:5000/',
                    version: '0.0.1',
                    release_tags: ['dev']
                });
            default:
                throw new Error('Module not supported ' + module_name);
            // // TODO: this should call the real service wizard.
            // console.log('calling upstream...', module_name, version);
            // const upstreamResult = await this.callUpstreamService(module_name, version);
            // // throw new Error('Unsupported service module: ' + module_name);
            // return upstreamResult;
        }
    }

}