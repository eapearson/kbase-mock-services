import { ServiceWrapper, HandleProps } from "../../base/jsonrpc11/ServiceWrapper.ts";
import { Normal } from "./methods/Normal.ts";
import { NoParams } from "./methods/NoParams.ts";
import { InternalError } from "./methods/InternalError.ts";
import { NoResult } from "./methods/NoResult.ts";
import { StringParam } from "./methods/StringParam.ts";
import { IntegerParam } from "./methods/IntegerParam.ts";
import { FloatParam } from "./methods/FloatParam.ts";
import { BooleanParam } from "./methods/BooleanParam.ts";
import { JSONRPC11Exception } from "../../base/jsonrpc11/types.ts";

export default class JSONRPC11TestService extends ServiceWrapper {
    handle({ method, params, token }: HandleProps): Promise<any> {
        switch (method) {
            case 'basic':
                return new Normal({ params, token, dataDir: this.dataDir }).run();
            case 'no-params':
                return new NoParams({ params, token, dataDir: this.dataDir }).run();
            case 'internal-error':
                return new InternalError({ params, token, dataDir: this.dataDir }).run();
            case 'no-result':
                return new NoResult({ params, token, dataDir: this.dataDir }).run();
            case 'string-param':
                return new StringParam({ params, token, dataDir: this.dataDir }).run();
            case 'integer-param':
                return new IntegerParam({ params, token, dataDir: this.dataDir }).run();
            case 'float-param':
                return new FloatParam({ params, token, dataDir: this.dataDir }).run();
            case 'boolean-param':
                return new BooleanParam({ params, token, dataDir: this.dataDir }).run();
            default:
                throw new JSONRPC11Exception({
                    message: `Cannot find method ${method}`,
                    code: -32601,
                    name: 'JSONRPCError',
                    error: null
                });
        }
    }
}