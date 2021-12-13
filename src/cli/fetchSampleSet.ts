import SampleServiceClient from "../clients/coreServices/SampleService/SampleServiceClient.ts";
import WorkspaceClient, {ObjectSpecification} from "../clients/coreServices/Workspace.ts";
import UserProfileClient from "../clients/coreServices/UserProfile.ts";
import GetArgs from "../lib/args.ts";
import {saveJSON} from "../lib/utils.ts";

interface ServiceDef {
    url: string;
}

interface FetchSampleArgs {
    sampleSetRef: {
        workspaceId: number,
        objectId: number,
        objectVersion: number;
    },
    services: {
        SampleService: ServiceDef,
        Workspace: ServiceDef,
        UserProfile: ServiceDef;
    },
    token: string,
    timeout: number,
    destination: string;
}

class GetFetchSampleArgs extends GetArgs<FetchSampleArgs> {
    get(): FetchSampleArgs {
        const ref = this.mustGetString('ref');
        const [workspaceId, objectId, objectVersion] = ref.split('/').map(part => parseInt(part));

        const env = this.getString('env', 'ci');

        return {
            sampleSetRef: {
                workspaceId, objectId, objectVersion
            },
            token: this.mustGetString('token'),
            destination: this.mustGetString('dest'),
            timeout: this.getInt('timeout', 5000),
            services: {
                SampleService: {
                    url: `https://${env}.kbase.us/services/sampleservice`
                },
                Workspace: {
                    url: `https://${env}.kbase.us/services/ws`
                },
                UserProfile: {
                    url: `https://${env}.kbase.us/services/user_profile/rpc`
                }
            }
        };
    }
}


export interface SampleSetObject {
    description: string;
    samples: Array<{
        id: string,
        name: string,
        version: number;
    }>;
}


async function main() {
    // get args
    const {
        sampleSetRef,
        services: {
            SampleService, Workspace, UserProfile
        },
        token,
        timeout,
        destination
    } = new GetFetchSampleArgs(Deno.args).get();

    const sampleServiceClient = new SampleServiceClient({
        url: SampleService.url,
        token,
        timeout
    });

    const workspaceService = new WorkspaceClient({
        url: Workspace.url,
        token,
        timeout
    });

    // Fetch sample set:
    const ref = [sampleSetRef.workspaceId, sampleSetRef.objectId, sampleSetRef.objectVersion].join('/');
    const sampleSetResult = await workspaceService.get_objects2({
        objects: [{ref}],
        ignoreErrors: 0,
        no_data: 0
    });
    const sampleSet = (sampleSetResult.data[0].data as unknown) as SampleSetObject;
    const objectSuffix = [sampleSetRef.workspaceId, sampleSetRef.objectId, sampleSetRef.objectVersion].join('_');
    saveJSON(destination, 'Workspace', `object_${objectSuffix}.json`, sampleSetResult.data[0]);

    // Get everything for each sample...
    for (const {id: sampleId, version: sampleVersion} of sampleSet.samples) {
        // fetch requested sample
        const sample = await sampleServiceClient.get_sample({id: sampleId, version: sampleVersion});
        saveJSON(destination, 'SampleService', `sample_${sampleId}_${sampleVersion}.json`, sample);

        // fetch acl for sample
        const sampleACL = await sampleServiceClient.get_sample_acls({id: sampleId, as_admin: 0});
        saveJSON(destination, 'SampleService', `sample_acl_${sampleId}.json`, sampleACL);

        // fetch linked objects for sample
        const linkedObjects = await sampleServiceClient.get_data_links_from_sample({
            id: sampleId,
            version: sampleVersion
        });
        saveJSON(destination, 'SampleService', `sample_data_link_${sampleId}_${sampleVersion}.json`, linkedObjects);

        // build set of linked objects
        const refs: Array<ObjectSpecification> = linkedObjects.links.map(({upa}) => {
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
            const objectSuffix = [workspaceId, objectId, objectVersion].join('_');
            const path = objectInfos.paths[i];
            saveJSON(destination, 'Workspace', `object_info_${objectSuffix}.json`, {
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
            saveJSON(destination, 'UserProfile', `user_profile_${profile.user.username}.json`, profile);
        }
    }
}

try {
    main();
} catch (ex) {
    console.error('ERROR!', ex);
}