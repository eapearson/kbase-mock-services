import {ServiceClient} from "../JSONRPC11/ServiceClient.ts";
import {EpochTime, SDKBoolean} from "../types.ts";
import {JSONObject, JSONObjectOf, objectToJSONObject} from "../../json.ts";


export interface ObjectIdentity {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: string;
    ver?: number;
    ref?: string;
}

export interface WorkspaceIdentity {
    workspace?: string;
    id?: number;
}

export interface ObjectSpecification {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: number;
    ver?: number;
    ref?: string;
    'obj_path'?: Array<ObjectIdentity>;
    'obj_ref_path'?: Array<string>;
    'to_obj_path'?: Array<ObjectIdentity>;
    'to_obj_ref_path'?: Array<string>;
    'find_reference_path'?: number; // bool
    included?: string;
    'strict_maps'?: number; // bool
    'strict_arrays'?: number; // bool
}

export interface GetObjectInfo3Params {
    objects: Array<ObjectSpecification>;
    includeMetadata?: number; // bool
    ignoreErrors?: number; // bool
}

export type ObjectInfo = [
    number, // objid
    string, // object name
    string, // object type
    string, // save date timestamp YYYY-MM-DDThh:mm:ssZ
    number, // object version
    string, // saved by
    number, // workspace id
    string, // workspace name
    string, // md5 checksum
    number, // size in bytes
    Metadata // metadata
];

export type WorkspaceInfo = [
    number, // workspace id
    string, // workspace name
    string, // workspace owner (username)
    string, // modification timestamp (iso 8601)
    number, // last object id
    string, // user permission (one char)
    string, // global permission (one char)
    string, // lock status
    Metadata  // metadata
];

export type Metadata = JSONObjectOf<string>;

export interface GetObjectInfo3Result extends JSONObject {
    infos: Array<ObjectInfo>;
    paths: Array<Array<string>>;
}

export interface GetWorkspaceInfoParams extends WorkspaceIdentity {
}

export interface GetWorkspaceInfoResult {

}

export type TimeString = string;


export interface ListWorkspaceInfoParams {
    perm?: string;
    owners?: Array<string>;
    meta?: Metadata;
    after?: TimeString;
    before?: TimeString;
    after_epoch?: EpochTime;
    before_epoch?: EpochTime;
    excludeGloba?: SDKBoolean;
    showDeleted?: SDKBoolean;
    showOnlyDeleted?: SDKBoolean;
}

export interface ExternalDataUnit extends JSONObject {
    resource_name: string;
    resource_url: string;
    resource_version: string;
    resource_release_date: Timestamp;
    resource_release_epoch: EpochMS;
    data_url: string;
    data_id: string;
    description: string;
}

export interface SubAction extends JSONObject {
    name: string;
    ver: string;
    code_url: string;
    commit: string;
    endpoint_url: string;
}

export interface ProvenanceAction extends JSONObject {
    time: Timestamp;
    epoch: EpochMS;
    caller: string;
    service: string;
    service_ver: string;
    method: string;
    method_params: Array<JSONObject>;
    script: string;
    script_ver: string;
    script_command_line: string;
    input_ws_objects: Array<ObjectRef>;
    resolved_ws_objects: Array<ObjectRef>;
    intermediate_incoming: Array<string>;
    intermediate_outgoing: Array<string>;
    external_data: Array<ExternalDataUnit>;
    subactions: Array<SubAction>;
    custom: SimpleMap<string>;
    description: string;
}

export interface SimpleMap<T> {
    [key: string]: T
}

export type Username = string;
export type WorkspaceID = number;
export type EpochMS = number;
export type ObjectRef = string;
export type Timestamp = string;

export interface ObjectData extends JSONObject {
    data: JSONObject;
    info: ObjectInfo;
    path: Array<string>;
    provenance: Array<ProvenanceAction>;
    creator: Username;
    orig_wsid: WorkspaceID;
    created: Timestamp;
    epoch: EpochMS;
    refs: Array<ObjectRef>;
    copied: ObjectRef;
    copy_source_inaccessible: SDKBoolean;
    extracted_ids: SimpleMap<Array<ObjectRef>>;
    handle_error: string;
    handle_stacktrace: string;
}

export interface GetObjects2Params {
    objects: Array<ObjectSpecification>,
    ignoreErrors: SDKBoolean,
    no_data: SDKBoolean
}

export interface GetObjects2Result extends JSONObject {
    data: Array<ObjectData>
}

export type ListWorkspaceInfoResult = Array<WorkspaceInfo>;

export default class WorkspaceClient extends ServiceClient {
    module: string = 'Workspace';

    // TODO: should be void not null
    async ver(): Promise<string> {
        const [result] = await this.callFunc<[], [string]>('ver', []);
        return result;
    }

    async get_object_info3(params: GetObjectInfo3Params): Promise<GetObjectInfo3Result> {
        const [objectInfo] = await this.callFunc<[JSONObject], [GetObjectInfo3Result]>('get_object_info3', [objectToJSONObject(params)]);
        return objectInfo as GetObjectInfo3Result;
    }

    async get_workspace_info(params: GetWorkspaceInfoParams): Promise<WorkspaceInfo> {
        const [result] = await this.callFunc<[JSONObject], [WorkspaceInfo]>('get_workspace_info', [objectToJSONObject(params)]);
        return result;
    }

    async list_workspace_info(params: ListWorkspaceInfoParams): Promise<ListWorkspaceInfoResult> {
        const [result] = await this.callFunc<[JSONObject], [ListWorkspaceInfoResult]>('list_workspace_info', [objectToJSONObject(params)]);
        return result;
    }

    async get_objects2(params: GetObjects2Params): Promise<GetObjects2Result> {
        const [result] = await this.callFunc<[JSONObject], [GetObjects2Result]>('get_objects2', [objectToJSONObject(params)]);
        return result;
    }
}
