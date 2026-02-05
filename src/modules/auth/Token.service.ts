import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CookiePayload } from './types/payload';
import { AuthMessage } from 'src/common/enums/message.enum';

@Injectable()
export class TokenService {
    constructor(
        private jwtService : JwtService
    ){}
    generateOtpToken(payload:CookiePayload){
        const token = this.jwtService.sign(payload,{
            secret:process.env.OTP_TOKEN_SECRET,
            expiresIn:"24h",
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
}