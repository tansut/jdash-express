"use strict";
var express = require("express");
var _1 = require("../");
var bp = require("body-parser");
var http = require("http");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (done, port, baseUr) {
    var app;
    var router;
    app = express();
    var router = express.Router();
    app.use(bp.urlencoded({ extended: true }));
    app.use(bp.json());
    app.use(baseUr, router);
    _1.default({
        provider: null
    }).use(router);
    var server = http.createServer(app);
    server.listen(port, function (err) {
        !err && console.log("Test server running on port " + port);
        done && done(err);
    });
};
