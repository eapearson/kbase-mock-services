import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import NarrativeJobService from './services/NarrativeJobService';
// import ServiceHandler from './ServiceHandler';
// import ServiceWizardAPI from './services/ServiceWizard';
import JSONRPC11TestService from './services/jsonrpc11';
import ServiceHandler from './base/jsonrpc11/ServiceHandler';


import { ServiceHandler as ServiceHandler20 } from './base/jsonrpc20/ServiceHandler';
import JSONRPC20TestService from './services/jsonrpc20';
import ServiceWizard from './services/serviceWizard';

const app: express.Application = express();

app.use(cors());
app.options('*', cors());

app.use(cookieParser());

// app.use(express.json());
app.use(bodyParser.text({
    type: () => {
        return true;
    }
}));


// const TOKEN = process.env['TOKEN'];
// if (!TOKEN) {
//     throw new Error('TOKEN missing');
// }

// const taxonomy = express.Router();
// Server.loadServices(taxonomy, 'services/re-taxonomy/index');
// app.use('taxonomy', taxonomy);

// for rest api
// Server.buildServices(app, Taxonomy);

// app.route('/services/service_wizard').post((request, response) => {
//     const contentType = request.headers['content-type'];
//     if (contentType !== 'application/json') {
//         throw new Error('Invalid response: Not application/json');
//     }

//     const { version, method, id, params } = request.body;
//     console.log('service wizard?', params);
//     if (method === 'ServiceWizard.get_service_status') {
//         const rpcResponse = {
//             version: '1.1',
//             id: Date.now(),
//             result: [
//                 {
//                     git_commit_hash: 'fe9d63b10fba22000c837b45890179c338f4cfa5',
//                     status: 'active',
//                     version: '1.3.0',
//                     hash: 'fe9d63b10fba22000c837b45890179c338f4cfa5',
//                     release_tags: ['dev'],
//                     url: 'http://localhost:3001/dynservices/taxonomy-re-api',
//                     module_name: 'taxonomy_re_api',
//                     health: 'active',
//                     up: 1
//                 }
//             ]
//         };
//         response.setHeader('content-type', 'application/json');
//         response.send(JSON.stringify(rpcResponse));
//         console.log('service wizard response', rpcResponse);
//     }
// });

console.log('Adding service wizard');
// app.route('/services/service_wizard').post(async (request, response) => {
//     const contentType = request.headers['content-type'];
//     console.log('content type', contentType);
//     if (contentType !== 'application/json') {
//         throw new Error('Invalid response: Not application/json');
//     }

//     const token = request.headers.authorization;
//     let rpcResponse: JSONRPC11Response;
//     if (!token) {

//     } else {
//         const { version, method, id, params } = JSON.parse(request.body);

//         const [methodName, functionName] = method.split('.');

//         console.log('params', params);

//         const api = new ServiceWizardAPI({
//             upstreamURL: 'https://ci.kbase.us/services/service_wizard',
//             token
//         });
//         const result = await api.handle(functionName, params);
//         rpcResponse = {
//             version: '1.1',
//             id: uuid.v4(),
//             result: [result]
//         };
//     }

//     // console.log('Request?', request.body);


//     response.setHeader('content-type', 'application/json');
//     response.send(JSON.stringify(rpcResponse));
// });

const serviceWizardService = new ServiceHandler<ServiceWizard>({
    app,
    path: '/services/service_wizard',
    module: 'ServiceWizard',
    handler: new ServiceWizard({
        upstreamURL: 'https://ci.kbase.us/services/service_wizard'
    })
});
serviceWizardService.start();

const jsonrpc11Service = new ServiceHandler<JSONRPC11TestService>({
    app,
    path: '/test/jsonrpc11',
    module: 'Test',
    handler: new JSONRPC11TestService()
});

jsonrpc11Service.start();

const jsonrpc20Service = new ServiceHandler20<JSONRPC20TestService>({
    app,
    path: '/test/jsonrpc20',
    module: 'Test',
    handler: new JSONRPC20TestService()
});

jsonrpc20Service.start();

// app.route('/test/jsonrpc11').post(async (request, response) => {
//     const contentType = request.headers['content-type'];
//     if (contentType !== 'application/json') {
//         throw new Error('Invalid request: Not application/json');
//     }

//     const { version, method, id, params } = JSON.parse(request.body);
//     if (version !== '1.1') {
//         throw new Error('Invalid request: Not version 1.1');
//     }

//     const [moduleName, functionName] = method.split('.');
//     if (moduleName !== 'JSONRPC11Test') {
//         throw new Error('Invalid request: Not module "JSONRPC11Test"');
//     }


//     const api = new JSONRPC11TestService();

//     const service = new ServiceHandler<JSONRPC11TestService>(

//     )

//     const result = await api.handle({
//         method: functionName,
//         params,
//         token: TOKEN
//     });
//     const rpcResponse = {
//         version: '1.1',
//         id: Date.now(),
//         result: [result]
//     };
//     response.setHeader('content-type', 'application/json');
//     response.send(JSON.stringify(rpcResponse));
// });

// // app.route('/dynservices/taxonomy-re-api').post((request, response) => {
// //     const contentType = request.headers['content-type'];
// //     console.log('content type', contentType);
// //     if (contentType !== 'application/json') {
// //         throw new Error('Invalid response: Not application/json');
// //     }

// //     const { version, method, id, params } = request.body;

// //     const [methodName, functionName] = method.split('.');

// //     console.log('params', params);

// //     const tax = new Taxonomy();
// //     const result = tax.handle(functionName, params);
// //     const rpcResponse = {
// //         version: '1.1',
// //         id: Date.now(),
// //         result: [result]
// //     };
// //     response.setHeader('content-type', 'application/json');
// //     response.send(JSON.stringify(rpcResponse));
// // });

// app.route('/dynserv/instance.OntologyAPI').post(async (request, response) => {
//     const contentType = request.headers['content-type'];
//     console.log('content type', contentType);
//     if (contentType !== 'application/json') {
//         throw new Error('Invalid response: Not application/json');
//     }

//     const { version, method, id, params } = request.body;

//     const [methodName, functionName] = method.split('.');

//     const api = new OntologyAPI();
//     const result = await api.handle(functionName, params);
//     const rpcResponse = {
//         version: '1.1',
//         id: Date.now(),
//         result: [result]
//     };
//     response.setHeader('content-type', 'application/json');
//     response.send(JSON.stringify(rpcResponse));
// });



// class NarrativeJobServiceHandler extends ServiceHandler<NarrativeJobService> { }

// const njsService = new NarrativeJobServiceHandler({
//     app,
//     path: '/services/njsw_wrapper',
//     module: 'NarrativeJobService',
//     handler: new NarrativeJobService()
// });

// // njsService.loadHappy{}

// njsService.start();

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Mock Services listening on port ${PORT}`);
});