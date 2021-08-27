import ModuleMethod from "../../../base/jsonrpc11/ModuleMethod";
import { JSONRPC11Exception } from "../../../base/jsonrpc11/types";
import {isJSONArray, isJSONObject} from "../../../types/json";

export interface CancelJobParam {
    job_id: string;
}

export type CancelJobParams = Array<CancelJobParam>;

export type CancelJobResult = null;

export class CancelJob extends ModuleMethod<CancelJobParams, null> {
    validateParams(possibleParams: any): CancelJobParams {
        if (!isJSONArray(possibleParams)) {
             throw new JSONRPC11Exception({
                    message: 'Invalid params - expected array',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: null
                });
        }

        const [param] = possibleParams;
        if (!isJSONObject(param)) {
             throw new JSONRPC11Exception({
                    message: 'Invalid params - expected param to be an object',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: null
                });
        }

        if ('job_id' in param) {
            const job_id = param.job_id;
            if (!job_id) {
                throw new JSONRPC11Exception({
                    message: 'Invalid params - missing argument',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: null
                });
            }
            if (typeof job_id !== 'string') {
                throw new JSONRPC11Exception({
                    message: 'Invalid params - "job_id" must be a string',
                    code: -32602,
                    name: 'JSONRPCError',
                    error: null
                });
            }
            if (!/[a-f0-9]{24}/.test(job_id)) {
                const message = `Job ID ${job_id} is not a legal ID`;
                throw new JSONRPC11Exception({
                    message,
                    code: -32500,
                    name: 'JSONRPCError',
                    error: null
                });
            }
            return (param  as unknown) as CancelJobParams;
        } else {
            throw new JSONRPC11Exception({
                message: 'Invalid params - missing argument',
                code: -32602,
                name: 'JSONRPCError',
                error: null
            });
        }
    }

    async callFunc([params]: CancelJobParams): Promise<CancelJobResult> {
        switch (params.job_id) {
            case '01234567890123456789012a':
                return null;
            case '01234567890123456789012b':
                // TODO: note that the username is included in the message.
                // That is unfortunate, and not necessary. It means that auth should be
                // simulated as well. Argh.
                // Also stack trace, oh why???
                throw new JSONRPC11Exception({
                    message: `There is no job ${params.job_id} viewable by user eapearson`,
                    code: -32500,
                    name: 'JSONRPCError',
                    error: 'some\nlong\nstack\ntrace'
                });
            // .setCode(10)
            // .setData({
            //     job_id: params.job_id
            // });
            case '01234567890123456789012c':
                // Note - same error as above. Too bad.
                throw new JSONRPC11Exception({
                    message: `There is no job ${params.job_id} viewable by user eapearson`,
                    code: -32500,
                    name: 'JSONRPCError',
                    error: 'some\nlong\nstack\ntrace'
                });
            case '01234567890123456789012d':
                // TODO: need to trigger this error, but for now this is faked.
                throw new JSONRPC11Exception({
                    message: 'Job not active, cannot cancel',
                    code: -32500,
                    name: 'JSONRPCError',
                    error: null
                });
            default:
                throw new JSONRPC11Exception({
                    message: 'Not found',
                    code: 10,
                    name: 'JSONRPCError',
                    error: 'Job id not covered in sample data'
                });
            // throw new JSONRPC11Exception('Invalid params - job_id not covered in sample data')
            //     .setCode(-32602)
            //     .setData({
            //         job_id: params.job_id,
            //         covered_values: ['a']
            //     });
        }
    }
}