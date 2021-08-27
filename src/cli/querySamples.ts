import SampleServiceClient from "../clients/coreServices/SampleService/SampleServiceClient.ts";
import {JSONObject, objectToJSONObject} from "../json.ts";
import WorkspaceClient from "../clients/coreServices/Workspace.ts";

function output(obj: JSONObject) {
    console.log(JSON.stringify(obj, null, 4));
}

async function main(method: string) {
    const sampleService = new SampleServiceClient({
        url: 'https://ci.kbase.us/services/sampleservice',
        token: 'OUGRWA36DZMGHFYJL3WAMOFX2B5TCTHX',
        timeout: 5000
    });

    switch (method) {
        case 'status':
            const status = await sampleService.status();
            console.log(status);
        case 'get_sample':
            const sample = await sampleService.get_sample({
                id: '12318235-0bf3-48ef-9efd-8f202dc1db84',
                version: 1
            });
            output(objectToJSONObject(sample));
        case 'get_data_links_from_sample':
            const dataLinks = await sampleService.get_data_links_from_sample({
                id: '12318235-0bf3-48ef-9efd-8f202dc1db84',
                version: 1
            });
            output(objectToJSONObject(dataLinks));
        case 'get_sample_acls':
            const acls = await sampleService.get_sample_acls({
                id: '12318235-0bf3-48ef-9efd-8f202dc1db84',
                as_admin: 0
            });
            output(acls);
        case 'get_field_definitions':
            const defs = await sampleService.get_field_definitions({
                keys: ['sesar:igsn', 'description', 'latitude', 'longitude']
            });
            output(objectToJSONObject(defs));
        case 'get_field_groups':
            const groups = await sampleService.get_field_groups();
            output(objectToJSONObject(groups));

    }
}

await main('get_field_groups');