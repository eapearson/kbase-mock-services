
import { Normal } from "./methods/Normal";
import { NoParams } from "./methods/NoParams";
import { InternalError } from "./methods/InternalError";
import { NoResult } from "./methods/NoResult";
import { StringParam } from "./methods/StringParam";
import { IntegerParam } from "./methods/IntegerParam";
import { FloatParam } from "./methods/FloatParam";
import { BooleanParam } from "./methods/BooleanParam";
import { JSONRPC2Exception } from "../../base/jsonrpc20/types";
import { ServiceWrapper, HandleProps } from "../../base/jsonrpc20/ServiceWrapper";
import { Method1 } from "./methods/Method1";

export default class JSONRPC20TestService extends ServiceWrapper {
    async handle({ method, params, token }: HandleProps): Promise<any> {
        switch (method) {
            case 'basic':
                return new Normal({ params, token }).run();
            case 'no-params':
                return new NoParams({ params, token }).run();
            case 'internal-error':
                return new InternalError({ params, token }).run();
            case 'no-result':
                return new NoResult({ params, token }).run();
            case 'string-param':
                return new StringParam({ params, token }).run();
            case 'integer-param':
                return new IntegerParam({ params, token }).run();
            case 'float-param':
                return new FloatParam({ params, token }).run();
            case 'boolean-param':
                return new BooleanParam({ params, token }).run();
            case 'method1':
                return new Method1({ params, token }).run();
            default:
                throw new JSONRPC2Exception({
                    message: `Cannot find method ${method}`,
                    code: -32601,
                    name: 'JSONRPCError'
                });
        }
    }
}