"use strict";
var JDashApi = (function () {
    function JDashApi(options) {
        this.options = options;
        this.provider = options.provider;
    }
    JDashApi.prototype.handleError = function (err) {
    };
    JDashApi.prototype.getMyDashboardRoute = function (req, res, next) {
        var principal = this.options.principal(req);
        this.provider.searchDashboards({
            appid: principal.appid,
            user: principal.user
        }).then(function (model) { return res.send(model); });
    };
    JDashApi.prototype.searchDashboardsRoute = function (req, res, next) {
        var principal = this.options.principal(req);
        var search = req.body.search;
        var query = req.body.query;
        this.provider.searchDashboards({
            appid: principal.appid,
            shareWith: search.shareWith,
            user: search.user
        }, query).then(function (model) { return res.send(model); });
    };
    JDashApi.prototype.createDashboardRoute = function (req, res, next) {
        var model = req.body;
        var principal = this.options.principal(req);
        model.user = principal.user;
        this.provider.createDashboard(principal.appid, model).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.use = function (router) {
        router.get('/dashboard/my', this.getMyDashboardRoute.bind(this));
        router.post('/dashboard/create', this.createDashboardRoute.bind(this));
        router.post('/dashboard/search', this.searchDashboardsRoute.bind(this));
        return this;
    };
    return JDashApi;
}());
exports.JDashApi = JDashApi;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (options) { return new JDashApi(options); };
