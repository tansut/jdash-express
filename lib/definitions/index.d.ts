/// <reference types="es6-promise" />
/// <reference types="express" />
import { IDBProvider } from 'jdash-api-core';
import * as express from 'express';
export interface IPrincipal {
    user: string;
    appid: string;
    inRole?(string: any): boolean | Promise<boolean>;
}
export interface ApiOptions {
    principal: (req: express.Request) => IPrincipal;
    provider: IDBProvider;
}
export declare class JDashApi {
    options: ApiOptions;
    provider: IDBProvider;
    handleError(err: any): void;
    deleteDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    saveDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    createDashletRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    saveDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): any;
    getMyDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    deleteDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    searchDashboardsRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    createDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    getDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    use(router: express.IRouter<any>): this;
    constructor(options: ApiOptions);
}
declare var _default: (options: ApiOptions) => JDashApi;
export default _default;
