import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthTypes } from 'src/common/enums/type.enum';
import { AuthMethod } from 'src/common/enums/method.enum';
import { isEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMessage, LOGINMESSAGE, REGISTERMESSAGE } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';
import { TokenService } from './Token.service';
import type{ Request, Response } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';
import { REQUEST } from '@nestjs/core';

@Injectable({scope:Scope.REQUEST})
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileRepo: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private OtpRepo: Repository<OtpEntity>,
        private tokenService: TokenService,
        @Inject(REQUEST) private request:Request
    ) { }
    async userExistance(authDto: AuthDto, res: Response) {
        const { method, type, username } = authDto
        let result:AuthResponse
        switch (type) {
            case AuthTypes.LOGIN:
                result = await this.login(method, username)
                return this.sendResponse(res, result)
            case AuthTypes.REGISTER:
                result = await this.register(method, username)
                return this.sendResponse(res, result)
            default:
                throw new UnauthorizedException()
        }
    }
    async login(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.CheckUserExistance(method, validUsername)
        if (!user) throw new UnauthorizedException(LOGINMESSAGE.USER_NOT_EXISTS)
        const otp = await this.sendOtp(user.id)
        const token = this.tokenService.generateOtpToken({ user_id: user.id })
        return {
            token,
            code: otp.code
        }


    }
    async register(method: AuthMethod, email: string) {
        if (method !== AuthMethod.EMAIL) throw new BadRequestException(REGISTERMESSAGE.INVALID_REGISTER_DATA)
        if (!isEmail(email)) throw new BadRequestException(REGISTERMESSAGE.INVAID_EMAIL_FORMAT)
        let user = await this.UserRepo.findOneBy({ email })
        if (user) throw new ConflictException(REGISTERMESSAGE.CONFLICT)
        

        user = this.UserRepo.create({
            email,
            username: nanoid(10)
        })
        user = await this.UserRepo.save(user)
        const token = this.tokenService.generateOtpToken({ user_id: user.id })
        const otp = await this.sendOtp(user.id)
        return {
            token,
            code: otp.code
        }
    }
    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.EMAIL:
                if (isEmail(username)) return username
                throw new BadRequestException(REGISTERMESSAGE.INVAID_EMAIL_FORMAT)
            case AuthMethod.USERNAME:
                return username
            default:
                throw new UnauthorizedException("username data is not valid")
        }
    }
    async CheckUserExistance(method: AuthMethod, validUsername: string) {
        let user: UserEntity | null
        if (method === AuthMethod.EMAIL) {
            user = await this.UserRepo.findOneBy({ email: validUsername })
            if (!user) throw new UnauthorizedException(LOGINMESSAGE.EMAIL_NOT_FOUND)
            return user
        }
        else if (method === AuthMethod.USERNAME) {
            user = await this.UserRepo.findOneBy({ username: validUsername })
            if (!user) throw new UnauthorizedException(LOGINMESSAGE.USERNAME_NOT_FOUND)
            return user
        }
        else throw new BadRequestException(LOGINMESSAGE.INVALID_LOGIN_DATA)
    }
    async sendOtp(user_id: number) {
        const code = randomInt(10000, 99999)
        const expires_in = new Date(Date.now() + 1000 * 60 * 2)
        let otp = await this.OtpRepo.findOneBy({ user_id })
        if (otp) {
            otp.code = code
            otp.expires_in = expires_in
        }
        else {
            otp = this.OtpRepo.create({
                code,
                expires_in,
                user_id
            })
        }
        await this.OtpRepo.save(otp)
        return otp
    }
    async checkOtp(code:string|number){
        const token = this.request.cookies?.[COOKIE_KEYS.OTP]
        if(!token) throw new UnauthorizedException(AuthMessage.EXPIRED_CODE)
        const payload = this.tokenService.verifyOtpToken(token)
        const otp = await this.OtpRepo.findOneBy({user_id:payload.user_id})
        if(!otp) throw new UnauthorizedException(AuthMessage.TRY_AGAIN)
        if(otp.code!=code) throw new UnauthorizedException(AuthMessage.INVALID_OTP)
        const now = new Date()
        if(otp.expires_in<now) throw new UnauthorizedException(AuthMessage.OTP_EXPIRED)
        const accessToken = this.tokenService.createAccessToken({user_id:otp.user_id})
        return accessToken
    }
    async sendResponse(res: Response, result: AuthResponse) {
        res.cookie(COOKIE_KEYS.OTP, result.token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        })
        res.json({
            message: "otp sent",
            code: result.code
        })
    }
    async validateAccessToken(token:string){
        const {user_id} = this.tokenService.verifyAccessToken(token)
        const user = await this.UserRepo.findOneBy({id:user_id})
        if(!user) throw new UnauthorizedException(LOGINMESSAGE.LOGIN_AGAIN)
        return user
    }

}
