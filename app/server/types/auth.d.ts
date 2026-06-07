
type JwtPayload = {
    sub: string;
    company_id?: string | null;
    store_id?: string | null;
};

declare namespace Express {
    export interface Request {
        user?: AuthUserReqType;
    }
}

type AuthUserReqType = {
    id: string;
    company_id: string | null;
    store_id: string | null;
}

type UserRefreshTokenType = {
    id: string;
    user_id: string;
    token: string;
    expires_at: string;
    created_at: string;
}

type CreateUserRefreshTokenDTO =
    Pick<UserRefreshTokenType,
        | "user_id"
        | "token"
    > & {
        expires_at: Date,
    }
