import * as express from 'express';
import jdashexpress from '../';
import * as bp from 'body-parser';
import * as http from "http";

export default (done: Function, port: number, baseUr: string) => {
    var app: express.Application;
    var router: express.Router;

    app = express();
    var router = express.Router();

    app.use(bp.urlencoded({ extended: true }));
    app.use(bp.json())

    app.use(baseUr, router);

    jdashexpress({
        provider: null,
        principal: null
    }).use(router);



    const server = http.createServer(app);
    server.listen(port, (err) => {
        !err && console.log(`Test server running on port ${port}`);
        done && done(err);
    });
}

