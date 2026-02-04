import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpEntity } from '../user/entities/otp.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { UserEntity } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity,ProfileEntity,OtpEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
