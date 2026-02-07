import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto, ForgotPasswordDto } from './dto/auth.dto';
import { AUTH_RESULTS_ENUM, AuthTypes, TOKEN_TYPE } from 'src/common/enums/type.enum';
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
import { MailService } from './mail.service';
import { OTP_TYPE_ENUM } from 'src/common/enums/checkOtpType.enum';

@Injectable({scope:Scope.REQUEST})
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileRepo: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private OtpRepo: Repository<OtpEntity>,
        private tokenService: TokenService,
        private mailService: MailService,
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
        if(user.verified!==true){
            const otp = await this.sendOtp(user.id,TOKEN_TYPE.VERIFY)
            await this.mailService.sendMail(user.email , "verification code", `your code is: ${otp.code}`)
            return {
                message:"a verification code was to your email",
                type:AUTH_RESULTS_ENUM.REGISTER
            }
        }
        const token =  this.tokenService.createAccessToken({user_id:user.id})
        return {
            message : "login successful",
            token,
            type:AUTH_RESULTS_ENUM.LOGIN
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
        const otp = await this.sendOtp(user.id,TOKEN_TYPE.VERIFY)
        await this.mailService.sendMail(email,"register verification code",`your code is: ${otp.code}`)
        return {
            message:REGISTERMESSAGE.VERIFICATION_CODE_SENT,
            type:AUTH_RESULTS_ENUM.REGISTER,
            // code: otp.code,
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
    async sendOtp(user_id: number , tokenType:TOKEN_TYPE) {
        if (!Object.values(TOKEN_TYPE).includes(tokenType)) throw new BadRequestException("invalid request type")
        const code = randomInt(10000, 99999)
        const time = tokenType===TOKEN_TYPE.VERIFY ? 2 : 10
        const expires_in = new Date(Date.now() + 1000 * 60 * time)
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
        let token:string
        if(tokenType===TOKEN_TYPE.VERIFY){
            token = this.tokenService.generateOtpToken({ user_id })
        }else{
            token = this.tokenService.createForgotPassToken({user_id})
        }
        await this.OtpRepo.save(otp)
        return {
            token,
            code:otp.code,
        }
    }
    async checkOtp(code:string|number ,type:OTP_TYPE_ENUM){
        
        const token = this.request.cookies?.[COOKIE_KEYS.OTP]
        if(!token) throw new UnauthorizedException(AuthMessage.EXPIRED_CODE)
        const payload = this.tokenService.verifyOtpToken(token)
        const otp = await this.OtpRepo.findOneBy({user_id:payload.user_id})
        if(!otp) throw new UnauthorizedException(AuthMessage.TRY_AGAIN)
        if(otp.code!=code) throw new UnauthorizedException(AuthMessage.INVALID_OTP)
        const now = new Date()
        if(otp.expires_in<now) throw new UnauthorizedException(AuthMessage.OTP_EXPIRED)
        if(type===OTP_TYPE_ENUM.VERIFY_USER){
            const verify = await this.verifyUser(otp.user_id)
            if(!verify) throw new UnauthorizedException(AuthMessage.UNEXPECTED_ERR)
            return {
                message:"account verified"
            }
        }
        return "check complete"
    }
    //is being used in Auth Guard do not delete
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
    async verifyUser(user_id:number){
        const user = await this.UserRepo.findOneBy({id:user_id})
        if(!user) throw new UnauthorizedException(LOGINMESSAGE.USER_NOT_EXISTS)
        if(user.verified) throw new BadRequestException(REGISTERMESSAGE.USER_VERIFIED)
        user.verified = true
        await this.UserRepo.save(user)
        return true
    }
    async forgotPassword(dto:ForgotPasswordDto){
        const {email} = dto
        if(!isEmail(email))throw new UnauthorizedException(REGISTERMESSAGE.INVAID_EMAIL_FORMAT)
        const user = await this.UserRepo.findOneBy({email})
        if(!user) throw new UnauthorizedException(LOGINMESSAGE.USER_NOT_EXISTS)
        const otp = await this.sendOtp(user.id,TOKEN_TYPE.FORGOTPASS)
        await this.mailService.sendMail(email,"forgot password code",`here is your password reset code: ${otp.code}`)
        return {
            message:"code sent",
            token:otp.token
        }
    }
}
