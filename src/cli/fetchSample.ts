import { anyToJSONValue } from "../json.ts";
import SampleServiceClient from "../clients/coreServices/SampleService/SampleServiceClient.ts";
import WorkspaceClient, { ObjectSpecification } from "../clients/coreServices/Workspace.ts";
import UserProfileClient from "../clients/coreServices/UserProfile.ts";

function getArgs() {
    return {
        sampleId: '12318235-0bf3-48ef-9efd-8f202dc1db84',
        sampleVersion: 1,
        services: {
            SampleService: {
                url: 'https://ci.kbase.us/services/sampleservice'
            },
            Workspace: {
                url: 'https://ci.kbase.us/services/ws'
            },
            UserProfile: {
                url: 'https://ci.kbase.us/services/user_profile/rpc'
            }
        },
        token: 'OUGRWA36DZMGHFYJL3WAMOFX2B5TCTHX',
        timeout: 5000,
        destination: 'out'
    };
}

function output(obj: any) {
    console.log(JSON.stringify(anyToJSONValue(obj), null, 4));
}

function save(dest: string, name: string, obj: any) {
    const output = JSON.stringify(anyToJSONValue(obj), null, 4);
    Deno.writeTextFile(`${dest}/${name}`, output);
}

async function main() {
    // get args
    const {
        sampleId, sampleVersion,
        services: {
            SampleService, Workspace, UserProfile
        },
        token,
        timeout,
        destination
    } = getArgs();

    // fetch requested sample
    const sampleServiceClient = new SampleServiceClient({
        url: SampleService.url,
        token,
        timeout
    });
    const sample = await sampleServiceClient.get_sample({ id: sampleId, version: sampleVersion });
    save(destination, `sample_${sampleId}_${sampleVersion}.json`, sample);

    // fetch acl for sample
    const sampleACL = await sampleServiceClient.get_sample_acls({ id: sampleId, as_admin: 0 });
    save(destination, `sample_acl_${sampleId}.json`, sampleACL);

    // fetch linked objects for sample
    const linkedObjects = await sampleServiceClient.get_data_links_from_sample({ id: sampleId, version: sampleVersion });
    save(destination, `sample_data_link_${sampleId}_${sampleVersion}.json`, linkedObjects);

    // build set of linked objects
    const workspaceService = new WorkspaceClient({
        url: Workspace.url,
        token,
        timeout
    });
    const refs: Array<ObjectSpecification> = linkedObjects.links.map(({ upa }) => {
        return {
            ref: upa
        };
    });
    const objectInfos = await workspaceService.get_object_info3({
        objects: refs,
        includeMetadata: 1,
        ignoreErrors: 0
    });
    for (let i = 0; i < objectInfos.infos.length; i += 1) {
        const info = objectInfos.infos[i];
        const [objectId, , , , objectVersion, , workspaceId] = info;
        const objectSuffix = [workspaceId, objectId, objectVersion].join('-');
        const path = objectInfos.paths[i];
        save(destination, `object_info_${objectSuffix}.json`, {
            info, path
        });
    }

    // build set of usernames
    const usernames = new Set<string>();
    usernames.add(sample.user);
    for (const username of sampleACL.read) {
        usernames.add(username);
    }
    for (const username of sampleACL.write) {
        usernames.add(username);
    }
    for (const username of sampleACL.admin) {
        usernames.add(username);
    }
    usernames.add(sampleACL.owner);
    for (const obj of linkedObjects.links) {
        usernames.add(obj.createdby);
    }
    for (const [, , , , , owner] of objectInfos.infos) {
        usernames.add(owner);
    }

    // fetch user profiles for usernames
    const userProfileService = new UserProfileClient({
        url: UserProfile.url,
        token,
        timeout
    });
    const profiles = await userProfileService.get_user_profile(Array.from(usernames));
    for (const profile of profiles) {
        save(destination, `user_profile_${profile.user.username}.json`, profile);
    }
}

try {
    main();
} catch (ex) {
    console.error('ERROR!', ex);
}