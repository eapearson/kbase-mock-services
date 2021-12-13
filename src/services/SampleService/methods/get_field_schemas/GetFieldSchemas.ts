import ModuleMethod from '../../../../base/jsonrpc11/ModuleMethod.ts';
import {ControlledField} from '../../types/ControlledField.ts';
import {getJSON} from '../../../../lib/utils.ts';

export interface GetFieldSchemasParam {
    keys: Array<string> | null;
}

export interface GetFieldSchemasResult {
    fields: Array<ControlledField>;
}

export type GetFieldSchemasParams = [GetFieldSchemasParam];

export type GetFieldSchemasResults = [GetFieldSchemasResult];

export class GetFieldSchemas extends ModuleMethod<GetFieldSchemasParams, GetFieldSchemasResults> {
    schemasList: Array<ControlledField> | null = null;
    schemasDb: Map<string, ControlledField> | null = null;

    validateParams(possibleParams: Array<any>): GetFieldSchemasParams {
        if (possibleParams.length !== 1) {
            throw new Error(`Expected one positional parameter, received ${possibleParams.length}`);
        }
        return possibleParams as unknown as GetFieldSchemasParams;
    }

    async ensureSchemas(): Promise<[Array<ControlledField>, Map<string, ControlledField>]> {
        if (this.schemasDb === null || this.schemasList === null) {
            this.schemasDb = new Map();
            this.schemasList = (await getJSON(
                this.dataDir,
                'SampleService',
                'schemas'
            )) as unknown as Array<ControlledField>;
            for (const schema of this.schemasList) {
                this.schemasDb.set(schema.kbase.sample.key, schema);
            }
        }
        return [this.schemasList, this.schemasDb];
    }

    // async getSchema(key: string) {
    //     const [schemasList, schemasDb] = await this.ensureSchemas();
    //     const field = schemasDb.get(key);
    //     if (typeof field === 'undefined') {
    //         throw new Error(`Key "${key}" not defined`);
    //     }
    //     return field;
    // }

    async callFunc(params: GetFieldSchemasParams): Promise<GetFieldSchemasResults> {
        const [schemasList, schemasDb] = await this.ensureSchemas();
        if (params[0].keys === null) {
            if (this.schemasList === null) {
                return [{fields: []}];
            }
            return [{fields: schemasList}];
        }
        const fields = await Promise.all(
            params[0].keys.map<ControlledField>((key) => {
                const schema = schemasDb.get(key);
                if (!schema) {
                    throw new Error(`Key "${key}" not defined`);
                }
                return schema;
            })
        );

        return [{fields}];
    }
}
