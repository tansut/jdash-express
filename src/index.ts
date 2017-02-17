import { DashboardCreateModel, DashboardModel, IJDashProvider } from 'jdash-core/lib';
import * as express from 'express';


export interface ApiOptions {
    provider: IJDashProvider;
}


export class JDashApi {

    provider: IJDashProvider;

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
        this.provider.createDashboard(model).then(result => res.send(result));
    }

    use(router: express.IRouter<any>) {
        router.get('/dashboard/:id', this.getDashboard.bind(this));
        router.post('/dashboard/create', this.createDashboard.bind(this));
        router.post('/dashboard/get/byuser', this.getDashboardsOfUser.bind(this));
    }

    constructor(public options: ApiOptions) {
        this.provider = options.provider;
    }
}

export default (options: ApiOptions) => new JDashApi(options);