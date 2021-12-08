import ModuleMethod, { ModuleMethodInput } from '../../../base/jsonrpc11/ModuleMethod.ts';
import GenericClient from "../../../clients/JSONRPC11/GenericClient.ts";
import { getJSON } from "../../../lib/utils.ts";
import { JSONArray, JSONArrayOf, JSONObject } from '../../../types/json.ts';

export interface Param  {
    'module_name': string;
    version?: string;
}

export type Params = [Param];

export type SDKBoolean = number;

export interface ServiceStatus extends JSONObject {
    'module_name': string;
    version: string;
    'git_commit_hash': string;
    'release_tags': Array<string>;
    hash: string;
    url: string;
    up: SDKBoolean;
    status: string;
    health: string;
}

export type Results = [ServiceStatus];

// export type GetServiceStatusArg = ModuleMethodInput;

export interface GetServiceStatusArg extends ModuleMethodInput {
    upstreamURL?: string;
}

export class GetServiceStatus extends ModuleMethod<Params, Results> {
    upstreamURL?: string;

    constructor(arg: GetServiceStatusArg) {
        super(arg);
        this.upstreamURL = arg.upstreamURL;
    }

    validateParams(paramsArray: JSONArray): Params {
        this.checkParamCount(1);

        const [possibleParams] = paramsArray;
        const params = this.ensureObject(possibleParams);

        const moduleName = this.validateStringParam(params, 'module_name');

        const result: Param = {
            'module_name': moduleName,
        };

        if ('version' in params) {
            const version = this.validateStringParam(params, 'version');
            result.version = version;
        }

        return [result];
    }

    async callUpstreamService(url: string, moduleName: string, version?: string): Promise<Results> {
        const client = new GenericClient({
            url,
            token: this.token || undefined,
            module: 'ServiceWizard',
            timeout: this.timeout
        });


        const params: JSONObject = {
            'module_name': moduleName
        }
        if (typeof version !== 'undefined') {
            params['version'] = version;
        }
    
        try {
            const [result] = await client.callMethod('get_service_status', [params]);
            return [result] as unknown as Results;
        } catch (ex) {
            console.error('ERROR', ex.message);
            return Promise.reject(ex);
        }
    }

    async callFunc([{ module_name: moduleName, version }]: Params): Promise<Results> {
        const fileName = (() => {
            if (version) {
                return `service_status_${moduleName}-${version}`;
            } else {
                return `service_status_${moduleName}`;
            }
        })();
        const data = (await getJSON(
            this.dataDir,
            'ServiceWizard',
            fileName
        )) as unknown as ServiceStatus;
        return [data];

        //     throw new Error('Module not supported ' + module_name);
        //     // // TODO: this should call the real service wizard.
        //     // console.log('calling upstream...', module_name, version);
        //     // const upstreamResult = await this.callUpstreamService(module_name, version);
        //     // // throw new Error('Unsupported service module: ' + module_name);
        //     // return upstreamResult;
        // }
    }
}
