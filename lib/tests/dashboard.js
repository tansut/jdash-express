"use strict";
var helper_1 = require("./helper");
function default_1() {
    describe('dashboard', function () {
        var newDashboardId;
        it('should create a dashboard', function () {
            var newDashboard = {
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                user: "xxx"
            };
            return helper_1.default.request('/dashboard/create', {
                method: 'POST',
                json: true,
                body: newDashboard
            }).then(function (result) {
                newDashboardId = result;
            });
        });
        it('should get a dashboard', function () {
            return helper_1.default.request('/dashboard/111', {
                method: 'GET',
                json: true
            }).then(function (result) {
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
