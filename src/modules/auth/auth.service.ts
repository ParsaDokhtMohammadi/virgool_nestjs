import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthTypes } from 'src/common/enums/type.enum';
import { AuthMethod } from 'src/common/enums/method.enum';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
    userExistance( authDto: AuthDto) {
        const {method , type , username} = authDto
        switch (type) {
            case AuthTypes.LOGIN:
                return this.login(method,username)
            case AuthTypes.REGISTER:
                return this.register(method,username)
            default:
                throw new UnauthorizedException()
        }
    }
    login(method:AuthMethod , username:string){
        return this.usernameValidator(method,username)
    }
    register(method:AuthMethod , username:string){

    }
    usernameValidator(method:AuthMethod,username:string){
        switch (method) {
            case AuthMethod.EMAIL:
                if(isEmail(username)) return username
                throw new BadRequestException("email is not correct")
            case AuthMethod.USERNAME:
            return username
            default:
                throw new UnauthorizedException("username data is not valid")
        }
    }
}
