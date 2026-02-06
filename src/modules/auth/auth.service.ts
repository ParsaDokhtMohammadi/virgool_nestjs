import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
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
import type{ Request } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';
import { REQUEST } from '@nestjs/core';
import {hashSync,genSaltSync, compareSync} from "bcrypt"

@Injectable({scope:Scope.REQUEST})
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileRepo: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private OtpRepo: Repository<OtpEntity>,
        private tokenService: TokenService,
        @Inject(REQUEST) private request:Request
    ) { }
    async userExistance(authDto: AuthDto) {
        const { method, type, username ,password , confirm_password} = authDto
        switch (type) {
            case AuthTypes.LOGIN:
                return await this.login(method, username , password)

            case AuthTypes.REGISTER:
              return await this.register(method,username,password,confirm_password)
            default:
                throw new UnauthorizedException()
        }
    }
    async login(method: AuthMethod, username: string , password:string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.CheckUserExistance(method, validUsername)
        if (!user) throw new UnauthorizedException(LOGINMESSAGE.USER_NOT_EXISTS)
        const passCheck = this.comparePassword(password,user.password)
        if(!passCheck) throw new UnauthorizedException(LOGINMESSAGE.INCORRECT_PASSWORD)
        const token =  this.tokenService.createAccessToken({user_id:user.id})
        return {
            message : "login successful",
            token
        }


    }
    async register(method: AuthMethod, email: string, password:string , confirm_password:string) {
        if (method !== AuthMethod.EMAIL) throw new BadRequestException(REGISTERMESSAGE.INVALID_REGISTER_DATA)
        if (!isEmail(email)) throw new BadRequestException(REGISTERMESSAGE.INVAID_EMAIL_FORMAT)
        if(!password || !confirm_password) throw new UnauthorizedException(REGISTERMESSAGE.INVALID_REGISTER_DATA)
        if(password!==confirm_password) throw new UnauthorizedException(REGISTERMESSAGE.PASSWORD_MISMATCH)
        let user = await this.UserRepo.findOneBy({ email })
        if (user) throw new ConflictException(REGISTERMESSAGE.CONFLICT)
        const hashedPassword = this.hashPassword(password)
        user = this.UserRepo.create({
            email,
            username: nanoid(10),
            password:hashedPassword
        })
        user = await this.UserRepo.save(user)
        const otp = await this.sendOtp(user.id)
        return {
            code: otp.code,
            token:otp.token
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
        const token = this.tokenService.generateOtpToken({ user_id })
        await this.OtpRepo.save(otp)
        return {
            token,
            code:otp.code
        }
    }
    async checkOtp(code:string|number){
        const token = this.request.cookies?.[COOKIE_KEYS.OTP]
        if(!token) throw new UnauthorizedException(AuthMessage.EXPIRED_CODE)
        const payload = this.tokenService.verifyOtpToken(token)
        const otp = await this.OtpRepo.findOneBy({user_id:payload.user_id})
        console.log(otp);
        
        if(!otp) throw new UnauthorizedException(AuthMessage.TRY_AGAIN)
        if(otp.code!=code) throw new UnauthorizedException(AuthMessage.INVALID_OTP)
        const now = new Date()
        if(otp.expires_in<now) throw new UnauthorizedException(AuthMessage.OTP_EXPIRED)
        const user = await this.UserRepo.findOneBy({id:otp.user_id})
        if(!user) throw new UnauthorizedException(LOGINMESSAGE.USER_NOT_EXISTS)
        if(user.verified) throw new BadRequestException(REGISTERMESSAGE.USER_VERIFIED)
        user.verified = true
        await this.UserRepo.save(user)
        return {
            message:"account verified"
        }
    }

    async validateAccessToken(token:string){
        const {user_id} = this.tokenService.verifyAccessToken(token)
        const user = await this.UserRepo.findOneBy({id:user_id})
        if(!user) throw new UnauthorizedException(LOGINMESSAGE.LOGIN_AGAIN)
        return user
    }
    hashPassword(password:string){
        const salt = genSaltSync(10)
        const hash = hashSync(password,salt)
        return hash
    }
    comparePassword(password:string ,hashedPassword:string){
        return compareSync(password,hashedPassword)
    }
}
