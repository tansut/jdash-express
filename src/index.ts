import {
    CreateResult,
    DashboardUpdateModel,
    DashletCreateModel,
    IClientProvider,
    ISearchDashboards,
    Query,
    QueryResult, DashboardCreateModel, DashboardModel, DashletUpdateModel
} from 'jdash-core';

import { IDBProvider } from 'jdash-api-core';
import * as express from 'express';

export interface IPrincipal {
    user: string;
    appid: string;
    inRole?(string): boolean | Promise<boolean>;
}

export interface ApiOptions {
    principal: (req: express.Request) => IPrincipal;
    provider: IDBProvider
}

export class JDashApi {
    provider: IDBProvider;

    handleError(err: any) {

    }

    getDashletsOfDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
        var dashboardId = req.params.id;
        var principal = this.options.principal(req);
        this.provider.searchDashlets({
            dashboardId: dashboardId
        }).then(result => res.send(result)).catch(err => next(err))
    }

    deleteDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.deleteDashlet(principal.appid, id).then(() => res.sendStatus(200)).catch(err => next(err))
    }

    saveDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        var id = req.params.id;
        var model = <DashletUpdateModel>req.body;
        this.provider.updateDashlet(id, model).then(result => res.sendStatus(200)).catch(err => next(err))
    }

    createDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var model = <DashletCreateModel>req.body;
        var principal = this.options.principal(req);
        this.provider.createDashlet(model).then(result => res.send(result)).catch(err => next(err));
    }


    saveDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        var id = req.params.id;
        var model = <DashboardUpdateModel>req.body;
        this.provider.updateDashboard(principal.appid, id, model).then(result => res.sendStatus(200)).catch(err => next(err))
    }

    getMyDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        this.provider.searchDashboards({
            appid: principal.appid,
            user: principal.user
        }).then(model => res.send(model));
    }

    deleteDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.deleteDashboard(principal.appid, id).then(() => res.sendStatus(200)).catch(err => next(err))
    }

    searchDashboardsRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        var search = <ISearchDashboards>req.body.search;
        var query = <Query>req.body.query;
        this.provider.searchDashboards({
            appid: principal.appid,
            shareWith: search.shareWith,
            user: search.user
        }, query).then(model => res.send(model));
    }

    createDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var model = <DashboardCreateModel>req.body;
        var principal = this.options.principal(req);
        model.user = principal.user;
        this.provider.createDashboard(principal.appid, model).then(result => res.send(result)).catch(err => next(err));
    }

    getDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.getDashboard(principal.appid, id).then(result => res.send(result)).catch(err => next(err));
    }

    use(router: express.IRouter<any>) {
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
    }

    constructor(public options: ApiOptions) {
        this.provider = options.provider;
    }
}

export default (options: ApiOptions) => new JDashApi(options);