import * as rq from 'request';
export default class  {
    static baseUrl: string;
    static request(url: string, options: rq.CoreOptions, userToken?: string): any;
}
