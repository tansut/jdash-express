"use strict";
var JDashApi = (function () {
    function JDashApi(options) {
        this.options = options;
        this.provider = options.provider;
    }
    JDashApi.prototype.handleError = function (err) {
    };
    JDashApi.prototype.getDashboard = function (req, res, next) {
        var id = req.params.id;
        if (validator.isEmpty(id))
            res.send(401, 'id missing');
        else {
        }
        this.provider.getDashboard(req.params.id).then(function (model) { return res.send(model); });
    };
    JDashApi.prototype.getDashboardsOfUser = function (req, res, next) {
        var user = req.body.user;
        var query = req.body.query;
        this.provider.getDashboardsOfUser(user, query).then(function (result) { return res.send(result); });
    };
    JDashApi.prototype.createDashboard = function (req, res, next) {
        var model = req.body;
        this.provider.createDashboard(model).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.use = function (router) {
        router.get('/dashboard/:id', this.getDashboard.bind(this));
        router.post('/dashboard/create', this.createDashboard.bind(this));
        router.post('/dashboard/get/byuser', this.getDashboardsOfUser.bind(this));
        return this;
    };
    return JDashApi;
}());
exports.JDashApi = JDashApi;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (options) { return new JDashApi(options); };
