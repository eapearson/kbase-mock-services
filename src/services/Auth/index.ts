import { getJSON } from '../../lib/utils.ts';
import { RESTHandler, RESTHandleProps } from '/base/RESTHandler.ts';
import { JSONValue } from '/json.ts';

export interface RESTPathHandlerProps {
    dataDir: string;
    path: string;
    query: { [key: string]: string };
    token: string | null;
    body: JSONValue;
}

export abstract class RESTPathHandler {
    dataDir: string;
    path: string;
    query: { [key: string]: string };
    token: string | null;
    body: JSONValue;
    constructor({ dataDir, path, query, token, body }: RESTPathHandlerProps) {
        this.dataDir = dataDir;
        this.path = path;
        this.query = query;
        this.token = token;
        this.body = body;
    }
    abstract run(): Promise<JSONValue>;
}

export class HandleGETMe extends RESTPathHandler {
    async run() {
        const fileName = `me_${this.token}`;
        const data = (await getJSON(this.dataDir, 'Auth', fileName)) as unknown as JSONValue;
        return data;
    }
}

export class HandleGETUsers extends RESTPathHandler {
    async run() {
        const usernames = this.query.list.split(',');
        const users: { [key: string]: JSONValue } = {};
        for (const username of usernames) {
            const filename = `user_${username}`;
            const userDisplayName = await getJSON(this.dataDir, 'Auth', filename);
            users[username] = userDisplayName;
        }

        return users;
    }
}

export class AuthServiceHandler extends RESTHandler {
    getHandler({ method, path, query, token, body }: RESTHandleProps): RESTPathHandler | null {
        switch (method) {
            case 'GET':
                switch (path) {
                    case 'api/V2/me':
                        return new HandleGETMe({ dataDir: this.dataDir, path, query, token, body });
                    case 'api/V2/users':
                        return new HandleGETUsers({ dataDir: this.dataDir, path, query, token, body });
                    default:
                        return null;
                }
            default:
                return null;
        }
    }

    handle({ method, path, query, token, body }: RESTHandleProps): Promise<JSONValue> {
        const handler = this.getHandler({ method, path, query, token, body });

        if (!handler) {
            throw new Error('404!!!');
        }
        return handler.run();
    }
}
