import { ServiceWrapper, HandleProps } from '/base/jsonrpc11/ServiceWrapper.ts';
import { JSONRPC11Exception } from '/base/jsonrpc11/types.ts';
import { GetSample } from './methods/get_sample/GetSample.ts';
import { GetDataLinksFromSample } from './methods/get_data_links_from_sample/GetDataLinksFromSample.ts';
import { GetSampleACLs } from './methods/get_sample_acls/GetSampleACLs.ts';
import { GetFormats } from './methods/get_formats/GetFormats.ts';
import { GetFieldDefinitions } from './methods/get_field_definitions/GetFieldDefinitions.ts';
import { GetFieldGroups } from './methods/get_field_groups/GetFieldGroups.ts';
import { GetSamples } from './methods/get_samples/GetSamples.ts';

export default class SampleService extends ServiceWrapper {
    handle({ method, params, token }: HandleProps): Promise<any> {
        switch (method) {
            // case 'status':
            //     return new Status({
            //         params, token
            //     }).run();
            case 'get_sample':
                return new GetSample({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            case 'get_samples':
                return new GetSamples({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            case 'get_data_links_from_sample':
                return new GetDataLinksFromSample({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            case 'get_sample_acls':
                return new GetSampleACLs({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            case 'get_field_definitions':
                return new GetFieldDefinitions({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            case 'get_field_groups':
                return new GetFieldGroups({
                    params,
                    token,
                    dataDir: this.dataDir,
                }).run();
            default:
                // TODO: find the actual workspace error message!
                throw new JSONRPC11Exception({
                    message: `Cannot find method [${method}]`,
                    code: -32601,
                    name: 'JSONRPCError',
                    error: null,
                });
        }
    }
}
