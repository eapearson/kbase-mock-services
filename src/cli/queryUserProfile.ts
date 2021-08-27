import WorkspaceClient from "../clients/coreServices/Workspace.ts";
import UserProfileClient from "../clients/coreServices/UserProfile.ts";


async function main(method: string) {
    const userProfile = new UserProfileClient({
        url: 'https://ci.kbase.us/services/user_profile/rpc',
        token: 'OUGRWA36DZMGHFYJL3WAMOFX2B5TCTHX',
        timeout: 5000
    });

    switch (method) {
        // case 'ver':
        //     const versionInfo = await workspace.ver();
        //     console.log('VERSION?', versionInfo);
        case 'get_user_profile':
            const userProfiles = await userProfile.get_user_profile(
               ['eapearson']
            );
            console.log(userProfiles);

    }
}

await main('get_user_profile');