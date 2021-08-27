export interface HandleProps {
    method: string;
    params: any;
    token?: string;
}

export abstract class ServiceWrapper {
    async abstract handle(props: HandleProps): Promise<any>;
}
