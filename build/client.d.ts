import ErrorManager, { ErrorManagerResult } from '@winkgroup/error-manager/build/client';
export declare class Backend {
    baseUrl: string;
    protected token: string;
    protected isTokenLoaded: boolean;
    constructor(baseUrl: string);
    getToken(): string;
    loginHashedPassword(pwdHash: string, username?: string): Promise<boolean>;
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
export interface EntityOptions<IEntityUI extends {
    id: string;
}> {
    emptyEntity?: IEntityUI;
    backend: Backend;
    errorManager: ErrorManager;
}
interface EntitySaveSuccessResult {
    status: 'success';
    data: any;
}
interface EntitySaveFailureResult extends ErrorManagerResult {
    error: unknown;
}
export declare type EntitySaveResult = EntitySaveSuccessResult | EntitySaveFailureResult;
export declare class Entity<IEntityUI extends {
    id: string;
}> {
    restEndpoint: string;
    options: EntityOptions<IEntityUI>;
    protected lastResult: EntitySaveResult | null;
    constructor(restEndpoint: string, inputOptions?: Partial<EntityOptions<IEntityUI>>);
    getValidationSchema(): import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    getResult(): EntitySaveResult | null;
    save(entity: IEntityUI, previous?: IEntityUI): Promise<EntitySaveResult>;
    static getDataToSend<IEntityUI extends {
        id: string;
    }>(entity: IEntityUI, previous?: IEntityUI, base?: IEntityUI): Partial<IEntityUI>;
}
export {};
