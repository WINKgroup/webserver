export default class Backend {
    baseUrl: string;
    protected token: string;
    protected isTokenLoaded: boolean;
    constructor(baseUrl: string);
    getToken(): string;
    login(password: string, username?: string): Promise<boolean>;
    logout(): Promise<void>;
    get(path: string, addBaseUrl?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    post(path: string, data: any, addBaseUrl?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    put(path: string, data: any): Promise<import("axios").AxiosResponse<any, any>>;
    patch(path: string, data: any): Promise<import("axios").AxiosResponse<any, any>>;
    remove(path: string): Promise<void>;
    materialTable<Model>(path: string, query: object): Promise<{
        data: Model[];
        page: any;
        totalCount: any;
    }>;
}
