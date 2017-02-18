/// <reference types="express" />
import { IJDashProvider } from 'jdash-core';
import * as express from 'express';
export interface ApiOptions {
    provider: IJDashProvider;
}
export declare class JDashApi {
    options: ApiOptions;
    provider: IJDashProvider;
    getDashboard(req: express.Request, res: express.Response, next: express.NextFunction): void;
    getDashboardsOfUser(req: express.Request, res: express.Response, next: express.NextFunction): void;
    createDashboard(req: express.Request, res: express.Response, next: express.NextFunction): void;
    use(router: express.IRouter<any>): this;
    constructor(options: ApiOptions);
}
declare var _default: (options: ApiOptions) => JDashApi;
export default _default;
