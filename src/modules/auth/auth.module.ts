import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from './Token.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { ProfileEntity } from '../user/entities/profile.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity,OtpEntity,ProfileEntity])],
  controllers: [AuthController],
  providers: [AuthService , TokenService ,JwtService , MailService],
  exports: [AuthService , TokenService ,JwtService , MailService,TypeOrmModule]

})
export class AuthModule {}
