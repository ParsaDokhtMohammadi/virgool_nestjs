import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";
import { AuthRequest } from "src/common/types/authRequest.type";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skipAuth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService :AuthService,
        private reflector:Reflector
    ){}
    async canActivate(context:ExecutionContext){
        const isAuthSkipped = this.reflector.get<boolean>(SKIP_AUTH,context.getHandler())
        if(isAuthSkipped) return true
        const httpContext = context.switchToHttp()
        const request:AuthRequest = httpContext.getRequest<AuthRequest>()
        const token = this.extractToken(request)
        request.user = await this.authService.validateAccessToken(token)       
        return true
    }

    protected extractToken(request:AuthRequest){
        const {authorization} = request.headers
        if(!authorization || authorization?.trim()=="") throw new UnauthorizedException(AuthMessage.LOGIN_REQUIRED)
        const [bearer, token] =authorization?.split(" ")
        if(bearer?.toLowerCase()!=="bearer"||!token || !isJWT(token))throw new UnauthorizedException(AuthMessage.LOGIN_REQUIRED)
        return token
    }
}