import { string2any } from './base';
export declare function omit<T extends string2any>(obj: T, ...keys: string[]): Partial<T>;
export declare function queryToString(obj: string2any): string;
export declare function mapToObject(m: Headers | Map<any, any>): string2any;
