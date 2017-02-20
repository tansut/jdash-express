import { IClientProvider, ISearchDashboards, CreateResult, Query, QueryResult } from 'jdash-core/lib/definitions';
import { DashboardCreateModel, DashboardModel } from 'jdash-core';
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

    getMyDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        this.provider.searchDashboards({
            appid: principal.appid,
            user: principal.user
        }).then(model => res.send(model));
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

    use(router: express.IRouter<any>) {
        router.get('/dashboard/my', this.getMyDashboardRoute.bind(this));
        router.post('/dashboard/create', this.createDashboardRoute.bind(this));
        router.post('/dashboard/search', this.searchDashboardsRoute.bind(this));
        return this;
    }

    constructor(public options: ApiOptions) {
        this.provider = options.provider;
    }
}

export default (options: ApiOptions) => new JDashApi(options);