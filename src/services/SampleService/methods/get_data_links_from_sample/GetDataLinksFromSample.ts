import ModuleMethod from '/base/jsonrpc11/ModuleMethod.ts';
import { JSONObject, JSONValue } from '/types/json.ts';
import { Username, WSUPA, EpochTimeMS } from '/services/common.ts';
import { getJSON } from '/lib/utils.ts';
import { SampleId, SampleVersion, SampleNodeId } from '../../types/Sample.ts';

export interface GetDataLinksFromSampleParam {
    id: SampleId;
    version: SampleVersion;
    'effective_time'?: EpochTimeMS;
}

export type GetDataLinksFromSampleParams = [GetDataLinksFromSampleParam];

export type DataId = string;

export interface DataLink extends JSONObject {
    linkid: string;
    upa: WSUPA;
    dataid: DataId | null;
    id: SampleId;
    version: SampleVersion;
    node: SampleNodeId;
    created: EpochTimeMS;
    createdby: Username;
    expiredby: Username | null;
    expired: EpochTimeMS | null;
}

export type DataLinks = Array<DataLink>;

export interface GetDataLinksFromSampleResult {
    links: DataLinks;
}

export type GetDataLinksFromSampleResults = [GetDataLinksFromSampleResult];

export class GetDataLinksFromSample extends ModuleMethod<GetDataLinksFromSampleParams, GetDataLinksFromSampleResults> {
    validateParams(possibleParams: Array<JSONValue>): GetDataLinksFromSampleParams {
        return possibleParams as unknown as GetDataLinksFromSampleParams;
    }

    async callFunc(params: GetDataLinksFromSampleParams): Promise<GetDataLinksFromSampleResults> {
        const param = params[0];
        const id = param.id;
        const version = param.version;
        const fileName = `sample_data_link_${id}_${version}`;
        const data = (await getJSON(
            this.dataDir,
            'SampleService',
            fileName
        )) as unknown as GetDataLinksFromSampleResult;
        return [data];
    }
}
