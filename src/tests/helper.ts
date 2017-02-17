import * as rp from 'request-promise-native';
import * as rq from 'request';

export default class {

    static baseUrl: string = '';

    static request(url: string, options: rq.CoreOptions, userToken?: string) {
        return rp(this.baseUrl.concat(url), options).then((result) => {
            return result;
        });
    }
}