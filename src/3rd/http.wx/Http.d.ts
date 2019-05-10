import { Res, Config, Data, ConfigWildcard } from './base';
export declare class Http {
    defaults: Config;
    constructor(config?: Config);
    request(config: ConfigWildcard): Promise<Res>;
    private _makeURL;
    private _noDataMethod;
    private _dataMethod;
    get(url: string, config?: Config): Promise<Res>;
    options(url: string, config?: Config): Promise<Res>;
    delete(url: string, config?: Config): Promise<Res>;
    head(url: string, config?: Config): Promise<Res>;
    post(url: string, data?: Data, config?: Config): Promise<Res>;
    patch(url: string, data?: Data, config?: Config): Promise<Res>;
    put(url: string, data?: Data, config?: Config): Promise<Res>;
}
