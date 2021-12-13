import {EpochTimeMS, Sample, SampleId, SampleNodeId, SampleVersion, SDKBoolean, Username, WSUPA} from './Sample.ts';
import {ControlledField} from './ControlledField.ts';
import * as path from 'https://deno.land/std@0.114.0/path/mod.ts';
import {JSONObject, toJSONObject} from '../../../lib/json.ts';
import {ServiceClient, ServiceClientParams} from '../../JSONRPC11/ServiceClient.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const groupsData = JSON.parse(await Deno.readTextFile(`${__dirname}/data/groups.json`));
const schemasData = JSON.parse(await Deno.readTextFile(`${__dirname}/data/schemas.json`));
const groups = groupsData as unknown as Array<FieldGroup>;
const schemas = schemasData as unknown as Array<ControlledField>;

interface SchemaMap {
    [k: string]: ControlledField;
}

const schemasMap: SchemaMap = schemas.reduce<SchemaMap>((m, schema) => {
    m[schema.kbase.sample.key] = schema;
    return m;
}, {});

export type ControlledFieldKey = string;

export interface FieldGroup extends JSONObject {
    name: string;
    title: string;
    fields: Array<ControlledFieldKey>;
}

export type FieldGroups = Array<FieldGroup>;

export interface StatusResult extends JSONObject {
    state: string;
    message: string;
    version: string;
    git_url: string;
    git_commit_hash: string;
}

/* Types for the get_sample method*/
export interface GetSampleParams {
    id: SampleId;
    version?: number;
    as_admin?: SDKBoolean;
}

export type GetSampleResult = Sample;

/* Types for the get_data_links_from_sample method */
export interface GetDataLinksFromSampleParams {
    id: SampleId;
    version: SampleVersion;
    effective_time?: EpochTimeMS;
}

export type DataId = string;

export interface DataLink extends JSONObject {
    linkid: string;
    upa: WSUPA;
    dataid: DataId | null;
    id: SampleId;
    version: SampleVersion;
    node: SampleNodeId;
    created: EpochTimeMS;
    createdby: Username;
    expiredby: Username | null;
    expired: EpochTimeMS | null;
}

export type DataLinks = Array<DataLink>;

export interface GetDataLinksFromSampleResult {
    links: DataLinks;
}

// TODO: document
export type KeyPrefix = 0 | 1 | 2;

export interface GetMetadataKeyStaticMetadataParams extends JSONObject {
    keys: Array<string>;
    prefix: KeyPrefix;
}

export interface StaticMetadataValue {
    display_name: string;
    description?: string;
}

export interface StaticMetadata {
    [key: string]: StaticMetadataValue;
}

export interface GetMetadataKeyStaticMetadataResult {
    static_metadata: StaticMetadata;
}

export interface GetSampleACLsParams extends JSONObject {
    id: SampleId;
    as_admin: SDKBoolean;
}

export interface SampleACLs extends JSONObject {
    owner: Username;
    admin: Array<Username>;
    write: Array<Username>;
    read: Array<Username>;
}

export type GetSampleACLsResult = SampleACLs;

export interface GetFieldSchemasParams extends JSONObject {
    keys: Array<string>;
}

// Should extend JSONObject -- but ControlledField has optional
// properties, so ...
export interface GetFieldSchemasResult {
    fields: Array<ControlledField>;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult extends JSONObject {
    groups: FieldGroups;
}

export interface SampleServiceClientParams extends ServiceClientParams {
    url: string;
}

export default class SampleServiceClient extends ServiceClient {
    module: string = 'SampleService';

    async status(): Promise<StatusResult> {
        const [result] = await this.callFunc<[], [StatusResult]>('status', []);
        return result;
    }

    async get_sample(params: GetSampleParams): Promise<GetSampleResult> {
        // TODO: revive the effort to provide result verification and type coercion.
        const [result] = (await this.callFunc<[JSONObject], [JSONObject]>('get_sample', [
            toJSONObject(params),
        ])) as unknown as Array<GetSampleResult>;
        return result;
    }

    async get_data_links_from_sample(params: GetDataLinksFromSampleParams): Promise<GetDataLinksFromSampleResult> {
        const [result] = await this.callFunc<[JSONObject], [JSONObject]>('get_data_links_from_sample', [
            toJSONObject(params),
        ]);
        return result as unknown as GetDataLinksFromSampleResult;
    }

    async get_metadata_key_static_metadata(
        params: GetMetadataKeyStaticMetadataParams
    ): Promise<GetMetadataKeyStaticMetadataResult> {
        const [result] = await this.callFunc<[GetMetadataKeyStaticMetadataParams], [JSONObject]>(
            'get_metadata_key_static_metadata',
            [params]
        );
        return result as unknown as GetMetadataKeyStaticMetadataResult;
    }

    async get_sample_acls(params: GetSampleACLsParams): Promise<GetSampleACLsResult> {
        const [result] = await this.callFunc<[GetSampleACLsParams], [GetSampleACLsResult]>('get_sample_acls', [params]);
        return result;
    }

    // These are not part of the sample service api, but should be:

    async get_field_definitions(params: GetFieldSchemasParams): Promise<GetFieldSchemasResult> {
        return {
            fields: params.keys.map((key) => {
                if (key in schemasMap) {
                    return schemasMap[key];
                } else {
                    throw new Error(`Field key ${key} not found`);
                }
            }),
        };
    }

    async get_field_groups(): Promise<GetFieldGroupsResult> {
        return {
            groups,
        };
    }
}
