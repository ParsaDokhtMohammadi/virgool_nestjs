import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from './Token.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Module({
  imports : [UserModule],
  controllers: [AuthController],
  providers: [AuthService , TokenService ,JwtService , MailService],

})
export class AuthModule {}
