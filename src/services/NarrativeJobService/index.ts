import { JSONValue } from "../../types/json";
import { ServiceWrapper, HandleProps } from '../../base/jsonrpc11/ServiceWrapper';
import ModuleMethod from '../../base/jsonrpc11/ModuleMethod';
import { CancelJobResult, CancelJob } from "./methods/CancelJob";
import { JSONRPC11Exception } from "../../base/jsonrpc11/types";

// export type MethodResult = [any | null, JSONRPC11Error | null];



type NarrativeJobServiceMethodResult = CancelJobResult;


export default class NarrativeJobServiceWrapper extends ServiceWrapper {
    async handle({ method, params, token }: HandleProps): Promise<any> {
        const x = method;
        switch (method) {
            case 'cancel_job':
                return new CancelJob({
                    params, token
                }).run();
            default:
                throw new JSONRPC11Exception({
                    message: `Can not find method [NarrativeJobService.${x}] in server class us.kbase.narrativejobservice.NarrativeJobServiceServer`,
                    code: -32601,
                    name: 'JSONRPCError',
                    error: null
                });
        }
    }
    // async cancelJob(possibleParams: [any]): Promise<CancelJobResult> {
    //     const method = new CancelJob(possibleParams);
    //     return method.callFunc();
    // }
    // addMockHappy(params: JSONValue, result: any) {

    // }
    // addMockSad(params: JSONValue, error: JSONRPC11Error) {

    // }
}
