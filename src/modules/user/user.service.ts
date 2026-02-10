import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import type{ AuthRequest } from 'src/common/types/authRequest.type';
import { PROFILE_MESSAGES } from 'src/common/enums/message.enum';
import { isDate } from 'class-validator';
import { GENDER_ENUM } from 'src/common/enums/gender.enum';
import { ProfileImages } from './types/files.type';


@Injectable({scope:Scope.REQUEST})
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private ProfileRepo:Repository<ProfileEntity>,
    @Inject(REQUEST) private request:AuthRequest
  ){

  }
 async changeProfile(files:ProfileImages,Dto:ProfileDto){ 
   const user = this.request.user;
   let {image_profile , image_bg} = files
   if(image_profile?.length > 0) {
    let [image] = image_profile
    Dto.image_profile = image?.path?.slice(7)
   }
   if(image_bg?.length > 0) {
    let [image] = image_bg
    Dto.image_bg = image?.path?.slice(7)
    
   }
  if (!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
  const { id } = user
  let profile = await this.ProfileRepo.findOneBy({user_id:id})
  const {bio,birthday,gender,linkedin_profile,nick_name,x_profile} = Dto
  if(profile) {
    if(bio) profile.bio = bio
    if(birthday&&isDate(new Date(birthday))) profile.birthday = birthday
    if(gender&&Object.values(GENDER_ENUM as any).includes(gender)) profile.gender = gender
    if(linkedin_profile) profile.linkedin_profile = linkedin_profile
    if(x_profile) profile.x_profile = x_profile
    if(nick_name) profile.nick_name = nick_name
    if(image_bg) profile.image_bg = Dto.image_bg
    if(image_profile) profile.image_profile = Dto.image_profile
  }else{
    profile = this.ProfileRepo.create(
      {
        bio,
        birthday,
        gender,
        linkedin_profile,
        nick_name,
        x_profile,
        image_bg:Dto.image_bg,
        image_profile:Dto.image_profile,
        user_id:id
      }
    )
  }
  await this.ProfileRepo.save(profile)
 }
 getProfile(){
  const user = this.request.user
  if (!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
  const {id} = user
  return this.userRepo.findOne({
    where:{id},
    relations:['profile']
  })
 }
}
