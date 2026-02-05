import { JwtService } from '@nestjs/jwt';
import { Injectable } from "@nestjs/common";
import { CookiePayload } from './types/payload';

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
}