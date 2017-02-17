"use strict";
var rp = require("request-promise-native");
var default_1 = (function () {
    function default_1() {
    }
    default_1.request = function (url, options, userToken) {
        return rp(this.baseUrl.concat(url), options).then(function (result) {
            return result;
        });
    };
    return default_1;
}());
default_1.baseUrl = '';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
