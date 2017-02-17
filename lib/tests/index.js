"use strict";
var server_1 = require("./server");
var dashboard_1 = require("./dashboard");
var helper_1 = require("./helper");
describe('jdash-express Tests', function () {
    before(function (done) {
        var url = '/api/jdash/v1', port = 5000;
        helper_1.default.baseUrl = "http://localhost:" + port + url;
        server_1.default(done, 5000, url);
    });
    dashboard_1.default();
    after(function () {
    });
});
