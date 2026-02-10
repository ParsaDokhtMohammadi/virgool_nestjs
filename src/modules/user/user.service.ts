import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import type{ AuthRequest } from 'src/common/types/authRequest.type';
import { PROFILE_MESSAGES } from 'src/common/enums/message.enum';


@Injectable({scope:Scope.REQUEST})
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private ProfileRepo:Repository<ProfileEntity>,
    @Inject(REQUEST) private request:AuthRequest
  ){

  }
 async changeProfile(Dto:ProfileDto){
  const user = this.request.user;
  if (!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
  const { id } = user
 }
}
