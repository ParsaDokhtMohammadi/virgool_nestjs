import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest.type";
import { AuthService } from "src/modules/auth/auth.service";
import { AuthMessage } from "../enums/message.enum";
import { isJWT } from "class-validator";
;

@Injectable()
export class AddUserToReqWOV implements NestMiddleware {
    constructor(
        private authService: AuthService,

    ) { }
    async use(req: AuthRequest, res: Response, next: NextFunction) {
        const token = this.extractToken(req)
        if (!token) return next()
        try {
            const user = await this.authService.validateAccessToken(token)
            if(user) req.user=user
        } catch (err) {
            console.log(err);
        }
        next()

    }




    protected extractToken(request: AuthRequest) {
        const { authorization } = request.headers
        if (!authorization || authorization?.trim() == "") return null
        const [bearer, token] = authorization?.split(" ")
        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) return null
        return token
    }
}