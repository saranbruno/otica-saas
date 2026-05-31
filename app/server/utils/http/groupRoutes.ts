import e, { Router } from "express";
import { api } from "../../server.js";


export default function groupRoutes(prefix: string, define: (router: Router) => void): Router {
    const router = Router();
    define(router);
    api.use(prefix, router);
    return router;
}

export function subgroupRoutes(router: e.Router, prefix: string, define: (router: Router) => void): Router {
    const subrouter = Router({ mergeParams: true });
    define(subrouter);
    router.use(prefix, subrouter);
    return subrouter;
}