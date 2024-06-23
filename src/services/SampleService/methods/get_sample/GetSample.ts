import ModuleMethod from "../../../../base/jsonrpc11/ModuleMethod.ts";
import {SDKBoolean} from "../../../common.ts";
import {getJSON} from "../../../../lib/utils.ts";
import {Sample, SampleId} from "../../types/Sample.ts";

export interface GetSampleParam {
    id: SampleId;
    version?: string;
    "as_admin"?: SDKBoolean;
}

export type GetSampleParams = [GetSampleParam];

export type GetSampleResult = Sample;

export type GetSampleResults = [GetSampleResult];

export class GetSample extends ModuleMethod<GetSampleParams, GetSampleResults> {
    // deno-lint-ignore no-explicit-any
    validateParams(possibleParams: Array<any>): GetSampleParams {
        // TODO: Validate here?
        return (possibleParams as unknown) as GetSampleParams;
    }

    async callFunc(params: GetSampleParams): Promise<GetSampleResults> {
        // we only support the ref atm:

        const version = (() => {
            if (typeof params[0].version === 'undefined') {
                return 1;
            } else {
                return parseInt(params[0].version);
            }
        })();

        const fileName = `sample_${params[0].id}_${version}`;
        const data = (await getJSON(this.dataDir, 'SampleService', fileName) as unknown) as GetSampleResult;
        return [data];
    }
}