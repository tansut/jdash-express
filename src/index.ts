import {
    CreateResult,
    DashboardUpdateModel,
    DashletCreateModel,
    IClientProvider,
    ISearchDashboards,
    Query,
    QueryResult, DashboardCreateModel, DashboardModel, DashletUpdateModel, DashletModel
} from 'jdash-core';
import * as moment from 'moment';


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


    deleteDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.deleteDashlet(id).then(() => res.sendStatus(200)).catch(err => next(err))
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

        var newModel: DashletModel = {
            title: model.title,
            configuration: model.configuration,
            description: model.description,
            createdAt: moment().utc().toDate(),
            dashboardId: model.dashboardId,
            moduleId: model.moduleId
        }
        this.provider.createDashlet(newModel).then(result => res.send(result)).catch(err => next(err));
    }


    saveDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var principal = this.options.principal(req);
        var id = req.params.id;
        var model = <DashboardUpdateModel>req.body;

        var dashletRemovalsPromise;
        if (model && model.layout && model.layout.dashlets) {
            dashletRemovalsPromise = this.provider.getDashboard(principal.appid, id).then((dashboardResult) => {
                var oldDashletIds = dashboardResult.dashlets.map(d => d.id);
                var newDashletIds = Object.keys(model.layout.dashlets);
                var removedDashletIds = oldDashletIds.filter((d) => {
                    return newDashletIds.indexOf(d) === -1;
                });

                return this.provider.deleteDashlet(removedDashletIds);
            });
        }
        if (dashletRemovalsPromise) {
            return dashletRemovalsPromise.then(() => {
                this.provider.updateDashboard(principal.appid, id, model)
                    .then(result => res.sendStatus(200)).catch(err => next(err));
            });
        } else {
            return this.provider.updateDashboard(principal.appid, id, model)
                .then(result => res.sendStatus(200)).catch(err => next(err));
        }
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
        var principal = this.options.principal(req);
        var model = <DashboardCreateModel>req.body;

        var newModel: DashboardModel = {
            title: model.title,
            appid: principal.appid,
            config: model.config,
            createdAt: moment().utc().toDate(),
            description: model.description,
            layout: model.layout,
            shareWith: model.shareWith,
            user: principal.user,
            id: null
        }

        this.provider.createDashboard(newModel).then(result => res.send(result)).catch(err => next(err));
    }

    getDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        var principal = this.options.principal(req);
        this.provider.getDashboard(principal.appid, id).then(result => res.send(result)).catch(err => next(err));
    }

    static lclControl(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!(req.host.indexOf("jdash") > -1 || req.host.indexOf(Buffer.from("bG9jYWxob3N0", "base64").toString()) > -1 || req.host.indexOf(Buffer.from("MTI3LjAuMC4x", "base64").toString()) > -1)) {
            var err = Buffer.from("SkRhc2ggVHJpYWwgQ2FuIE9ubHkgQmUgVXNlZCBXaXRoaW4gJ2xvY2FsaG9zdCAtIDEyNy4wLjAuMSAnIGRvbWFpbiBhZHJlc3Nlcw==", 'base64');
            res.status(500);
            res.write(err.toString());
            res.end();
        } else {
            next();
        }
    }

    use(router: express.IRouter<any>) {

        router.use(JDashApi.lclControl);
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
    }

    constructor(public options: ApiOptions) {
        this.provider = options.provider;
    }
}

export default (options: ApiOptions) => new JDashApi(options);