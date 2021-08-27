import WorkspaceClient from "../clients/coreServices/Workspace.ts";


async function main(method: string) {
    const workspace = new WorkspaceClient({
        url: 'https://ci.kbase.us/services/ws',
        token: 'OUGRWA36DZMGHFYJL3WAMOFX2B5TCTHX',
        timeout: 5000
    });

    switch (method) {
        case 'ver':
            const versionInfo = await workspace.ver();
            console.log('VERSION?', versionInfo);
            break;
        case 'get_object_info3':
            const objectInfo = await workspace.get_object_info3({
                objects: [{
                    ref: '53116/1/1'
                }],
                includeMetadata: 1,
                ignoreErrors: 0
            });
            console.log(objectInfo);
            break;
        case 'get_workspace_info':
            const workspaceInfo = await workspace.get_workspace_info({
                id: 53116
            });
            console.log(workspaceInfo);
            break;
        case 'list_workspace_info':
            const infos = await workspace.list_workspace_info({
                owners: ['eapearson']
            });
            console.log(infos);
            break;
        case 'get_objects2':
            const obj = await workspace.get_objects2({
                objects: [{
                    ref: '53116/1/1'
                }],
                ignoreErrors: 0,
                no_data: 0
            });
            console.log(obj);
            break;
        default:
            throw new Error(`Method "${method}" not supported`);
    }
}

await main('get_objects2');