import ModuleMethod from '../../../../base/jsonrpc11/ModuleMethod.ts';
import {UserProfile} from '../../types/UserProfile.ts';
import {getJSON} from '../../../../lib/utils.ts';

export declare type GetUserProfileParam = Array<string>;
export declare type GetUserProfileResult = Array<UserProfile>;

export type GetUserProfileParams = [GetUserProfileParam];
export type GetUserProfileResults = [GetUserProfileResult];

export class GetUserProfile extends ModuleMethod<GetUserProfileParams, GetUserProfileResults> {
    validateParams(possibleParams: Array<any>): GetUserProfileParams {
        return possibleParams as unknown as GetUserProfileParams;
    }

    async callFunc(params: GetUserProfileParams): Promise<GetUserProfileResults> {
        // we only support the ref atm:

        const result = await Promise.all(
            params[0].map<Promise<UserProfile>>(async (username) => {
                const fileName = `user_profile_${username}`;
                return (await getJSON(this.dataDir, 'UserProfile', fileName)) as unknown as UserProfile;
            })
        );

        return [result];
    }
}
