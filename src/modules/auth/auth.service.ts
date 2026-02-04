import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthTypes } from 'src/common/enums/type.enum';
import { AuthMethod } from 'src/common/enums/method.enum';
import { isEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { LOGINMESSAGE, REGISTERMESSAGE } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileRepo: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private OtpRepo: Repository<OtpEntity>
    ) { }
    userExistance(authDto: AuthDto) {
        const { method, type, username } = authDto
        switch (type) {
            case AuthTypes.LOGIN:
                return this.login(method, username)
            case AuthTypes.REGISTER:
                return this.register(method, username)
            default:
                throw new UnauthorizedException()
        }
    }
    async login(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username)
        const user = await this.CheckUserExistance(method,username)
        
        
        
        
    }
    async register(method: AuthMethod, email: string) {
            if(method!==AuthMethod.EMAIL) throw new BadRequestException(REGISTERMESSAGE.INVALID_REGISTER_DATA)
            if(!isEmail(email)) throw new BadRequestException(REGISTERMESSAGE.INVAID_EMAIL_FORMAT)
            let user = await this.UserRepo.findOneBy({email})
            if(user) throw new ConflictException(REGISTERMESSAGE.CONFLICT)
            user = this.UserRepo.create({
                email
            })
            user = await this.UserRepo.save(user)
            const otp = await this.saveOtp(user.id)
            return {
                message:REGISTERMESSAGE.OTPSENT+email,
                code:otp.code
            }
    }
    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.EMAIL:
                if (isEmail(username)) return username
                throw new BadRequestException("email is not correct")
            case AuthMethod.USERNAME:
                return username
            default:
                throw new UnauthorizedException("username data is not valid")
        }
    }
    async CheckUserExistance(method:AuthMethod , validUsername:string){
        let user:UserEntity|null
        if (method === AuthMethod.EMAIL) {
            user = await this.UserRepo.findOneBy({email:validUsername})
            if(!user) throw new UnauthorizedException(LOGINMESSAGE.EMAIL_NOT_FOUND) 
            return user
            }
        else if(method===AuthMethod.USERNAME){
            user = await this.UserRepo.findOneBy({username:validUsername})
            if(!user) throw new UnauthorizedException(LOGINMESSAGE.USERNAME_NOT_FOUND) 
            return user
        }
        else throw new BadRequestException(LOGINMESSAGE.INVALID_LOGIN_DATA)
    }
    async saveOtp(user_id:number){
        const code = randomInt(10000,99999)
        const expires_in = new Date(Date.now()+1000*60*2)
        let otp = await this.OtpRepo.findOneBy({user_id})
        if(otp){
            otp.code = code
            otp.expires_in =expires_in
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
    async checkOtp(){

    }
}
