import { TOKEN_TYPE } from "src/common/enums/type.enum"

export type CookiePayload={
    user_id:number,
    type:TOKEN_TYPE
}
export type AccessTokenPayload={
    user_id:number
}
export type ForgotPassTokenPayload={
    user_id:number
}
