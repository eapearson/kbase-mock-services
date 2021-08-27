import {JSONObject} from "../../../types/json.ts";

export interface User extends JSONObject {
    username: string;
    realname: string;
}

export interface UserProfile extends JSONObject {
    user: User;
    profile: {
        synced: {
            gravatarHash: string;
        };
        userdata: {
            jobTitle: string;
            jobTitleOther: string;
            organization: string;
            city: string;
            state: string;
            country: string;
            avatarOption: string;
            gravatarDefault: string;
        };
        metadata: {
            createdBy: string;
            created: string;
        };
    };
}