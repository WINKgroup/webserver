export default class Backend {
    rejectUnauthorized: boolean;
    constructor(rejectUnauthorized: boolean);
    get(): Promise<import("axios").AxiosResponse<any, any> | undefined>;
}
