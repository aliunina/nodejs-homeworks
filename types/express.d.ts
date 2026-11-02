import type { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            };
        }
    }
}

export interface AuthenticatedRequest<
    ReqBody = any,
    Params = {},
    ReqQuery = {},
> extends Request<Params, any, ReqBody, ReqQuery> {
    user: {
        id: string;
    };
}
