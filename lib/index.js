"use strict";
var moment = require("moment");
var JDashApi = (function () {
    function JDashApi(options) {
        this.options = options;
        this.provider = options.provider;
    }
    JDashApi.prototype.handleError = function (err) {
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
        var newModel = {
            title: model.title,
            configuration: model.configuration,
            description: model.description,
            createdAt: moment().utc().toDate(),
            dashboardId: model.dashboardId,
            moduleId: model.moduleId
        };
        this.provider.createDashlet(newModel).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
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
        var principal = this.options.principal(req);
        var model = req.body;
        var newModel = {
            title: model.title,
            appid: principal.appid,
            config: model.config,
            createdAt: moment().utc().toDate(),
            description: model.description,
            layout: model.layout,
            shareWith: model.shareWith,
            user: principal.user,
            id: null
        };
        this.provider.createDashboard(newModel).then(function (result) { return res.send(result); }).catch(function (err) { return next(err); });
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
