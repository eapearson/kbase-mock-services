export interface HandleProps {
    method: string;
    params: any;
    token: string | null;
}

export abstract class ServiceWrapper {
    async abstract handle(props: HandleProps): Promise<any>;
}
