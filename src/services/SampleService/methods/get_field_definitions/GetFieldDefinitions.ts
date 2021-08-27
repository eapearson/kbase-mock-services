import ModuleMethod from "/base/jsonrpc11/ModuleMethod.ts";
import { JSONValue } from "/types/json.ts";
import { ControlledField } from "../../types/ControlledField.ts";

export interface GetFieldDefinitionsParam {
    keys: Array<string>;
}

export interface GetFieldDefinitionsResult {
    fields: Array<ControlledField>;
}

export type GetFieldDefinitionsParams = [GetFieldDefinitionsParam];

export type GetFieldDefinitionsResults = [GetFieldDefinitionsResult];

export async function getJSON(fieldKey: string): Promise<JSONValue> {
    const dataDir = new URL('../../../../data/sampleservice/schemas', import.meta.url).pathname;
    const path = `${dataDir}/${fieldKey}.json`;
    const resultData = JSON.parse(await Deno.readTextFile(path));
    return (resultData as unknown) as JSONValue;
}

export class GetFieldDefinitions extends ModuleMethod<GetFieldDefinitionsParams, GetFieldDefinitionsResults> {
    validateParams(possibleParams: Array<any>): GetFieldDefinitionsParams {
        if (possibleParams.length !== 1) {
            throw new Error(`Expected one positional parameter, received ${possibleParams.length}`);
        }
        return (possibleParams as unknown) as GetFieldDefinitionsParams;
    }

    async callFunc(params: GetFieldDefinitionsParams): Promise<GetFieldDefinitionsResults> {
        const fields = await Promise.all(params[0].keys.map<Promise<ControlledField>>(async (key) => {
            const scrubbedKey = key.replace(/[:]/, "-");
            return (await getJSON(scrubbedKey) as unknown) as ControlledField;
        }));

        return [{ fields }];
    }
}