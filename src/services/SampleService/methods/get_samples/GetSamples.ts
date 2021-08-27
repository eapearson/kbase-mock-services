import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import { JSONObject } from "/json.ts";
import { SDKBoolean } from "/services/common.ts";
import { getFiles, getJSON } from "/lib/utils.ts";
import { Sample, SampleId, SampleVersion } from "../../types/Sample.ts";


export interface SampleIdentifier {
    id: SampleId;
    version?: SampleVersion;
}

export interface GetSamplesParam {
    samples: Array<SampleIdentifier>;
    "as_admin"?: SDKBoolean;
}

export type GetSamplesParams = [GetSamplesParam];

export type GetSamplesResult = Array<Sample>;

export type GetSamplesResults = [GetSamplesResult];

export class GetSamples extends ModuleMethod<GetSamplesParams, GetSamplesResults> {
    // deno-lint-ignore no-explicit-any
    validateParams(possibleParams: Array<any>): GetSamplesParams {
        // TODO: Validate here?
        return (possibleParams as unknown) as GetSamplesParams;
    }

    findMostRecentVersion(sampleId: SampleId): SampleVersion {
        const sampleRegex = new RegExp(`^sample_${sampleId}_([\\d]+)\\.json$`);
        const files = getFiles(this.dataDir, 'SampleService', (path: string) => {
            return sampleRegex.test(path);
        });
        const versions = files.map((path) => {
            const matched = path.match(sampleRegex);
            if (matched === null) {
                throw new Error('Not possible');
            }
            const [, version] = matched;
            return parseInt(version);
        });
        if (versions.length === 0) {
            throw new Error('No versions found - not possible');
        }
        return Math.max(...versions);
    }

    async callFunc(params: GetSamplesParams): Promise<GetSamplesResults> {
        const data = await Promise.all(params[0].samples.map(async ({ id, version }) => {
            const sampleVersion = (() => {
                if (typeof version === 'undefined') {
                    // Find most recent version of the sample.
                    return this.findMostRecentVersion(id);
                } else {
                    return version;
                }
            })();
            const fileName = `sample_${id}_${sampleVersion}`;
            return ((await getJSON(this.dataDir, 'SampleService', fileName)) as unknown) as Sample;
        }));
        return [data];
    }
}
