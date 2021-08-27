import { JSONObjectOf } from "../../../types/json.ts";
import { EpochTimeMS, SDKBoolean } from "../../common.ts";


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
    "obj_path"?: Array<ObjectIdentity>;
    "obj_ref_path"?: Array<string>;
    "to_obj_path"?: Array<ObjectIdentity>;
    "to_obj_ref_path"?: Array<string>;
    "find_reference_path"?: number; // bool
    included?: string;
    "strict_maps"?: number; // bool
    "strict_arrays"?: number; // bool
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
    after_epoch?: EpochTimeMS;
    before_epoch?: EpochTimeMS;
    excludeGloba?: SDKBoolean;
    showDeleted?: SDKBoolean;
    showOnlyDeleted?: SDKBoolean;
}

export type ListWorkspaceInfoResult = Array<WorkspaceInfo>;