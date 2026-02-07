import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AccessTokenPayload, CookiePayload, ForgotPassTokenPayload } from './types/payload';
import { AuthMessage, LOGINMESSAGE, RESET_PASS_MESSAGE } from 'src/common/enums/message.enum';

@Injectable()
export class TokenService {
    constructor(
        private jwtService : JwtService
    ){}
    generateOtpToken(payload:CookiePayload){
        const token = this.jwtService.sign(payload,{
            secret:process.env.OTP_TOKEN_SECRET,
            expiresIn:60*2
        })
        return token
    }
    verifyOtpToken(token:string):CookiePayload {

        try{
            return this.jwtService.verify(token,{
                secret:process.env.OTP_TOKEN_SECRET
            })
        }catch(err){
            throw new UnauthorizedException(AuthMessage.TRY_AGAIN)
        }
    }
    createAccessToken(payload:AccessTokenPayload){
       const token = this.jwtService.sign(payload,{
            secret:process.env.ACCESS_TOKEN_SECRET,
            expiresIn:"1y"
        })
        return token
    }
    verifyAccessToken(token:string){
        try{
            return this.jwtService.verify(token,{
                secret:process.env.ACCESS_TOKEN_SECRET
            })
        }catch(err){
            throw new UnauthorizedException(LOGINMESSAGE.LOGIN_AGAIN)
        }
    }
    createForgotPassToken(payload:ForgotPassTokenPayload){
       const token = this.jwtService.sign(payload,{
            secret:process.env.FORGOTPASS_TOKEN_SECRET,
            expiresIn:"10m"
        })
        return token
    }
    verifyForgotPassToken(token:string){
        try{
            return this.jwtService.verify(token,{
                secret:process.env.FORGOTPASS_TOKEN_SECRET
            })
        }catch(err){
            throw new UnauthorizedException(RESET_PASS_MESSAGE.EXPIRED_TOKEN)
        }
    }
}