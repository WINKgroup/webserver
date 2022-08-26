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
    delete(path: string): Promise<void>;
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
    isSaving?: (saving: boolean) => void;
    sendFeeback?: (result: EntityRequestResult) => void;
    sendFeedbackMessage?: (message: string) => void;
}
interface EntityRequestSuccessResult {
    status: 'success';
    data: any;
}
interface EntityRequestFailureResult extends ErrorManagerResult {
    error: unknown;
}
export declare type EntityRequestResult = EntityRequestSuccessResult | EntityRequestFailureResult;
export interface EntitySaveOptions<IEntityUI extends {
    id: string;
}> {
    previousEntity?: IEntityUI;
    successMessage: string;
}
export declare class Entity<IEntityUI extends {
    id: string;
}> {
    restEndpoint: string;
    options: EntityOptions<IEntityUI>;
    protected lastResult: EntityRequestResult | null;
    constructor(restEndpoint: string, inputOptions?: Partial<EntityOptions<IEntityUI>>);
    getValidationSchema(): import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    getResult(): EntityRequestResult | null;
    protected sendFeedback(successMessage: string): void;
    delete(id: string, successMessage?: string): Promise<EntityRequestResult>;
    save(entity: IEntityUI, inputOptions?: Partial<EntitySaveOptions<IEntityUI>>): Promise<EntityRequestResult>;
    static getDataToSend<IEntityUI extends {
        id: string;
    }>(entity: IEntityUI, previous?: IEntityUI, base?: IEntityUI): Partial<IEntityUI>;
}
export {};
