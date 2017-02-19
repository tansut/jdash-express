import { DashboardCreateModel, DashboardModel, IJDashProvider } from 'jdash-core';
import * as express from 'express';

export interface IPrincipal {
    user: string;
    appid: string;
    inRole?(string): boolean | Promise<boolean>;
}

export interface ApiOptions {
    principal: (req: express.Request) => IPrincipal;
    provider: IJDashProvider;
}


export class JDashApi {

    provider: IJDashProvider;

    handleError(err: any) {

    }

    getDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
        var id = req.params.id;
        if (validator.isEmpty(<string>id))
            res.send(401, 'id missing');
        else {

        }
        this.provider.getDashboard(req.params.id).then(model => res.send(model));
    }



    getDashboardsOfUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        var user = req.body.user;
        var query = req.body.query;
        this.provider.getDashboardsOfUser(user, query).then(result => res.send(result));
    }

    createDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
        var model = <DashboardCreateModel>req.body;
        model.user = this.options && this.options.principal ? this.options.principal(req).user : undefined;
        this.provider.createDashboard(model).then(result => res.send(result)).catch(err => next(err));
    }

    use(router: express.IRouter<any>) {
        router.get('/dashboard/:id', this.getDashboard.bind(this));
        router.post('/dashboard/create', this.createDashboard.bind(this));
        router.post('/dashboard/get/byuser', this.getDashboardsOfUser.bind(this));
        return this;
    }

    constructor(public options: ApiOptions) {
        this.provider = options.provider;
    }
}

export default (options: ApiOptions) => new JDashApi(options);