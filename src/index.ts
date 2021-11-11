import opine, { text, json, urlencoded } from 'https://deno.land/x/opine@1.9.0/mod.ts';
import { opineCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import ServiceHandler from '/base/jsonrpc11/ServiceHandler.ts';
import ServiceWizard from '/services/serviceWizard/index.ts';
import WorkspaceService from '/services/Workspace/index.ts';
import SampleService from '/services/SampleService/index.ts';
import UserProfileService from '/services/UserProfile/index.ts';
import GetArgs from '/lib/args.ts';
import RESTService from './base/RESTHandler.ts';
import { AuthServiceHandler } from './services/Auth/index.ts';

interface RunServerArgs {
    dataDir: string;
    port: number;
}

class GetRunServerArgs extends GetArgs<RunServerArgs> {
    get(): RunServerArgs {
        return {
            dataDir: this.mustGet(this.args, 'data-dir'),
            port: this.getInt(this.args, 'port', 3333),
        };
    }
}

function main() {
    const { dataDir, port } = new GetRunServerArgs().get();

    const app = opine();

    app.use(opineCors());
    app.use(text());
    app.use(json());
    app.use(urlencoded());

    // Add services.

    const serviceWizardService = new ServiceHandler<ServiceWizard>({
        app,
        path: '/services/service_wizard',
        module: 'ServiceWizard',
        handler: new ServiceWizard({
            upstreamURL: 'https://ci.kbase.us/services/service_wizard',
            dataDir,
        }),
    });
    serviceWizardService.start();

    const workspaceService = new ServiceHandler<WorkspaceService>({
        app,
        path: '/services/ws',
        module: 'Workspace',
        handler: new WorkspaceService({ dataDir }),
    });
    workspaceService.start();

    const sampleService = new ServiceHandler<SampleService>({
        app,
        path: '/services/sampleservice',
        module: 'SampleService',
        handler: new SampleService({ dataDir }),
    });
    sampleService.start();

    const userProfileService = new ServiceHandler<UserProfileService>({
        app,
        path: '/services/user_profile/rpc',
        module: 'UserProfile',
        handler: new UserProfileService({ dataDir }),
    });
    userProfileService.start();

    const authService = new RESTService({
        app,
        // path: new RegExp('^/services/auth/.*'),
        path: '/services/auth/*',
        module: 'Auth',
        handler: new AuthServiceHandler({ dataDir }),
    });
    authService.start();

    console.log('Services loaded');

    app.get('/', (_req, res) => {
        res.send('Hi');
    });

    app.listen(port, () => {
        `Server started on port ${port}`;
    });
}

try {
    main();
} catch (ex) {
    console.error('ERROR!', ex);
}
