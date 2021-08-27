import { ServiceWrapper, HandleProps } from '../../base/jsonrpc11/ServiceWrapper.ts';
import { Status } from './methods/status/Status.ts';
import { JSONRPC11Exception } from "../../base/jsonrpc11/types.ts";
import { GetObjectInfo3 } from "./methods/get_object_info3/GetObjectInfo3.ts";
import { Administer } from "./methods/administer/Administer.ts";

export default class WorkspaceService extends ServiceWrapper {
    handle({ method, params, token }: HandleProps): Promise<any> {
        console.log('WS', method, params, token);
        switch (method) {
            case 'status':
                return new Status({
                    params, token, dataDir: this.dataDir
                }).run();
            case 'get_object_info3':
                return new GetObjectInfo3({
                    params, token, dataDir: this.dataDir
                }).run();
            case 'administer':
                return new Administer({
                    params, token, dataDir: this.dataDir
                }).run();
            default:
                // TODO: find the actual workspace error message!
                throw new JSONRPC11Exception({
                    message: `Cannot find method [${method}]`,
                    code: -32601,
                    name: 'JSONRPCError',
                    error: null
                });
        }
    }
}
