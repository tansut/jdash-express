"use strict";
var JDashApi = (function () {
    function JDashApi(options) {
        this.options = options;
        this.provider = options.provider;
    }
    JDashApi.prototype.handleError = function (err) {
    };
    JDashApi.prototype.getDashletsOfDashboard = function (req, res, next) {
        var dashboardId = req.params.id;
        var principal = this.options.principal(req);
        this.provider.searchDashlets({
            dashboardId: dashboardId
        }).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.deleteDashletRoute = function (req, res, next) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.deleteDashlet(id).then(function () { return res.sendStatus(200); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.saveDashletRoute = function (req, res, next) {
        var principal = this.options.principal(req);
        var id = req.params.id;
        var model = req.body;
        this.provider.updateDashlet(id, model).then(function (result) { return res.sendStatus(200); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.createDashletRoute = function (req, res, next) {
        var model = req.body;
        var principal = this.options.principal(req);
        this.provider.createDashlet(model).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.saveDashboardRoute = function (req, res, next) {
        var principal = this.options.principal(req);
        var id = req.params.id;
        var model = req.body;
        this.provider.updateDashboard(principal.appid, id, model).then(function (result) { return res.sendStatus(200); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.getMyDashboardRoute = function (req, res, next) {
        var principal = this.options.principal(req);
        this.provider.searchDashboards({
            appid: principal.appid,
            user: principal.user
        }).then(function (model) { return res.send(model); });
    };
    JDashApi.prototype.deleteDashboardRoute = function (req, res, next) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.deleteDashboard(principal.appid, id).then(function () { return res.sendStatus(200); }).catch(function (err) { return next(err); });
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
    JDashApi.prototype.getDashboardRoute = function (req, res, next) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.getDashboard(principal.appid, id).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
    };
    JDashApi.prototype.use = function (router) {
        router.get('/dashboard/my', this.getMyDashboardRoute.bind(this));
        router.get('/dashboard/:id', this.getDashboardRoute.bind(this));
        router.post('/dashboard/create', this.createDashboardRoute.bind(this));
        router.post('/dashboard/search', this.searchDashboardsRoute.bind(this));
        router.post('/dashboard/delete/:id', this.deleteDashboardRoute.bind(this));
        router.post('/dashboard/save/:id', this.saveDashboardRoute.bind(this));
        router.get('/dashlet/bydashboard/:id', this.getDashletsOfDashboard.bind(this));
        router.post('/dashlet/create', this.createDashletRoute.bind(this));
        router.post('/dashlet/delete/:id', this.deleteDashletRoute.bind(this));
        router.post('/dashlet/save/:id', this.saveDashletRoute.bind(this));
        return this;
    };
    return JDashApi;
}());
exports.JDashApi = JDashApi;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (options) { return new JDashApi(options); };
