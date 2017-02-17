import { } from 'mocha';
import server from './server';
import dashboard from './dashboard';
import Helper from './helper';

describe('jdash-express Tests', function () {
    before(function (done) {
        var url = '/api/jdash/v1', port = 5000;
        Helper.baseUrl = `http://localhost:${port}${url}`;
        server(done, 5000, url);
    });
    dashboard();
    after(function () {

    });
});