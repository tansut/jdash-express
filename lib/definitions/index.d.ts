/// <reference types="es6-promise" />
/// <reference types="express" />
import { IDBProvider } from 'jdash-api';
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
    getMyDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    searchDashboardsRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    createDashboardRoute(req: express.Request, res: express.Response, next: express.NextFunction): void;
    use(router: express.IRouter<any>): this;
    constructor(options: ApiOptions);
}
declare var _default: (options: ApiOptions) => JDashApi;
export default _default;
