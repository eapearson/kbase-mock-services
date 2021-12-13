import opine, {text, urlencoded} from 'https://deno.land/x/opine@1.9.1/mod.ts';
import {opineCors} from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import ServiceHandler from './base/jsonrpc11/ServiceHandler.ts';
import ServiceWizard from './services/serviceWizard/index.ts';
import WorkspaceService from './services/Workspace/index.ts';
import SampleService from './services/SampleService/index.ts';
import UserProfileService from './services/UserProfile/index.ts';
import GetArgs from './lib/args.ts';
import RESTService from './base/RESTHandler.ts';
import {AuthServiceHandler} from './services/Auth/index.ts';

const TIMEOUT = 5000;

// TODO: get rid of this monkey's patch
// https://github.com/denoland/deno/issues/7217
declare global {
    interface ReadableStream<R = any> {
        getIterator(options?: { preventCancel?: boolean }): AsyncIterableIterator<R>;
    }
}

interface RunServerArgs {
    dataDir: string;
    port: number;
}

class GetRunServerArgs extends GetArgs<RunServerArgs> {
    get(): RunServerArgs {
        return {
            dataDir: this.mustGetString('data-dir'),
            port: this.getInt('port', 3333),
        };
    }
}

export function main() {
    const {dataDir, port} = new GetRunServerArgs(Deno.args).get();

    const app = opine();

    // We want to enable CORS by default since KBase should always use CORS.
    app.use(opineCors());

    // We want plain text to be available, not much can go wrong.
    app.use(text());

    // But we don't want to have JSON automatically parsed, as we want to
    // parse and catch errors to simulate specific server errors.
    // app.use(json());

    app.use(urlencoded());

    // Add services.

    const serviceWizardService = new ServiceHandler<ServiceWizard>({
        app,
        path: '/services/service_wizard/rpc',
        module: 'ServiceWizard',
        handler: new ServiceWizard({
            upstreamURL: 'https://ci.kbase.us/services/service_wizard',
            dataDir,
            timeout: TIMEOUT
        }),
    });
    serviceWizardService.start();

    const workspaceService = new ServiceHandler<WorkspaceService>({
        app,
        path: '/services/ws',
        module: 'Workspace',
        handler: new WorkspaceService({dataDir, timeout: TIMEOUT}),
    });
    workspaceService.start();

    const sampleService = new ServiceHandler<SampleService>({
        app,
        path: '/services/sampleservice',
        module: 'SampleService',
        handler: new SampleService({dataDir, timeout: TIMEOUT}),
    });
    sampleService.start();

    const userProfileService = new ServiceHandler<UserProfileService>({
        app,
        path: '/services/user_profile/rpc',
        module: 'UserProfile',
        handler: new UserProfileService({dataDir, timeout: TIMEOUT}),
    });
    userProfileService.start();

    const authService = new RESTService({
        app,
        // path: new RegExp('^/services/auth/.*'),
        path: '/services/auth/*',
        module: 'Auth',
        handler: new AuthServiceHandler({dataDir}),
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
    if (import.meta.main) {
        main();
    }
} catch (ex) {
    console.error('ERROR!', ex);
}
