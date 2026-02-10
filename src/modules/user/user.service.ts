import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';


@Injectable({scope:Scope.REQUEST})
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private ProfileRepo:Repository<ProfileEntity>,
    @Inject(REQUEST) private request:Request
  ){

  }
 async changeProfile(Dto:ProfileDto){

 }
}
