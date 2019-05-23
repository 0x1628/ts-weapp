export declare type string2any = {
    [key: string]: any;
};
export declare type Data = string2any | string | FormData;
export declare const methods: readonly ["get", "post", "patch", "put", "delete", "options", "head"];
export declare type Method = typeof methods[number];
interface ConfigBase {
    headers: {
        [key: string]: string;
    };
    data: Data;
    query: string2any | string;
    timeout: number;
    withCredentials: boolean;
    baseURL: string;
    transformRequest: ((config: Config) => Config)[];
    transformResponse: ((res: Res) => Res)[];
}
export declare type Config = Partial<ConfigBase>;
export declare type ConfigWildcard = Partial<ConfigBase> & {
    method?: Method;
    url: string;
};
export declare type Res = {
    data: string2any;
    rawData?: string;
    status: number;
    headers: string2any;
};
export {};
