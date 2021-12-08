import { ServiceWrapper, HandleProps } from '../../base/jsonrpc11/ServiceWrapper.ts';
import { JSONRPC11Exception } from '../../base/jsonrpc11/types.ts';
import { GetUserProfile } from './methods/get_user_profile/GetUserProfile.ts';
import { Status } from './methods/status/Status.ts';

export default class UserProfileService extends ServiceWrapper {
    handle({ method, params, token }: HandleProps): Promise<any> {
        switch (method) {
            // case 'status':
            //     return new Status({
            //         params, token
            //     }).run();
            case 'get_user_profile':
                return new GetUserProfile({
                    params,
                    token,
                    dataDir: this.dataDir,
                    timeout: this.timeout
                }).run();
            case 'status':
                return new Status({
                    params,
                    token,
                    dataDir: this.dataDir,
                    timeout: this.timeout
                }).run();
            default:
                // TODO: find the actual workspace error message!
                throw new JSONRPC11Exception({
                    message: `Cannot find UserProfile method [${method}]`,
                    code: -32601,
                    name: 'JSONRPCError',
                    error: null,
                });
        }
    }
}
