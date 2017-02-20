/// <reference types="request" />
/// <reference types="es6-promise" />
import * as rq from 'request';
export default class  {
    static baseUrl: string;
    static request(url: string, options: rq.CoreOptions, userToken?: string): Promise<any>;
}
