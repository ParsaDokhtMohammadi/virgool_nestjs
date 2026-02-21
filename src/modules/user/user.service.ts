import { MailService } from './../auth/mail.service';
import { AuthService } from './../auth/auth.service';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import type{ AuthRequest } from 'src/common/types/authRequest.type';
import { FOLLOW_MESSAGES, PROFILE_MESSAGES } from 'src/common/enums/message.enum';
import { isDate, isEmail } from 'class-validator';
import { GENDER_ENUM } from 'src/common/enums/gender.enum';
import { ProfileImages } from './types/files.type';
import { TOKEN_TYPE } from 'src/common/enums/type.enum';
import { changeEmailDto, changeUsernameDto } from './dto/changeCredentials.dto';
import { FollowEntity } from './entities/follow.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/Dtos/pagination.dto';
import { PaginationResolver } from 'src/common/utils/pagination.utils';


@Injectable({scope:Scope.REQUEST})
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private ProfileRepo:Repository<ProfileEntity>,
    @InjectRepository(FollowEntity) private FollowRepo:Repository<FollowEntity>,
    @Inject(REQUEST) private request:AuthRequest,
    private authService:AuthService,
    private mailService:MailService
  ){

  }
 async changeProfile(files:ProfileImages,Dto:ProfileDto){ 
   const user = this.request.user;
   if (!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
   const { id } = user
   let {image_profile , image_bg} = files
   if(image_profile?.length > 0) {
    let [image] = image_profile
    Dto.image_profile = image?.path?.slice(7)
   }
   if(image_bg?.length > 0) {
    let [image] = image_bg
    Dto.image_bg = image?.path?.slice(7)
    
   }
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
  return {
    message:PROFILE_MESSAGES.UPDATED
  }
 }
 getProfile(){
  const user = this.request.user
  if (!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
  const {id} = user
  return this.userRepo.createQueryBuilder(EntityNames.USER)
  .where({id})
  .leftJoinAndSelect("user.profile","profile")
  .loadRelationCountAndMap("user.followers","user.followers")
  .loadRelationCountAndMap("user.following","user.following")
  .getOne()
  
 }
 async changeEmail({email}:changeEmailDto){
    const LogedIn = this.request.user;
    if (!LogedIn) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
    const { id } = LogedIn
    if(!isEmail(email)) throw new BadRequestException(PROFILE_MESSAGES.INVALID_EMAIL)
    const user = await this.userRepo.findOneBy({id})
    if(!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOTFOUND)
    if(user.id!==id) throw new ConflictException(PROFILE_MESSAGES.CONFLICT_EMAIL)
    if(email===user.email) throw new BadRequestException(PROFILE_MESSAGES.SAME_EMAIL_UPDATE)
    user.pending_email = email
    await this.userRepo.save(user)
    const otp = await this.authService.sendOtp(id,TOKEN_TYPE.CHANGE_EMAIL)
    await this.mailService.sendMail(email,"change email verification code",`change email verification code: ${otp.code}`)
    return {
      message:PROFILE_MESSAGES.EMAIL_CHANGE_OTP,
      token:otp.token
    } 
 }
 async changeUsername({username}:changeUsernameDto){
    const LogedIn = this.request.user;
    if (!LogedIn) throw new UnauthorizedException(PROFILE_MESSAGES.NOT_LOGGEDIN);
    const { id } = LogedIn
    const user = await this.userRepo.findOneBy({id})
    if(!user) throw new UnauthorizedException(PROFILE_MESSAGES.NOTFOUND)
    if(user.id!==id) throw new ConflictException(PROFILE_MESSAGES.USERNAME_CONFLICT)
    if(username===user.username) throw new BadRequestException(PROFILE_MESSAGES.SAME_USERNAME_UPDATE)
    user.username = username
    await this.userRepo.save(user)
    return {
      message:PROFILE_MESSAGES.USERNAME_SUCCESS,
    } 
 }
 async followToggle(following_id:number){
  const user = this.request.user
  const following = await this.userRepo.findOneBy({id:following_id})
  if(!following) throw new NotFoundException(PROFILE_MESSAGES.NOTFOUND)
  const isFollowing = await this.FollowRepo.findOneBy({following_id,follower_id:user!.id})
  let message:string
  if(isFollowing){
    await this.FollowRepo.remove(isFollowing)
    message=FOLLOW_MESSAGES.UNFOLLOW
  }else{
    await this.FollowRepo.insert({
      following_id,
      follower_id:user!.id
    })
    message=FOLLOW_MESSAGES.FOLLOW
  }
  return {
    message
  }
 }
 async find(){
  return await this.userRepo.find()
 }
 async getFollowers(paginationDto:PaginationDto){
  const {limit , page , skip} = PaginationResolver(paginationDto)
  const user = this.request.user
  const [followers,count] = await this.FollowRepo.findAndCount({
    where : {following_id:user!.id},
    relations:{
      followers :{
        profile:true
      }
    },
    select:{
      id:true,
      followers:{
        id:true,
        username:true,
        profile:{
          id:true,
          nick_name:true,
          bio:true,
          image_bg:true,
          image_profile:true
        }
      }
    },
    skip,
    take:limit
  })
    return {
    followers
  }
}
async getFollowings(paginationDto:PaginationDto){
   const {limit , page , skip} = PaginationResolver(paginationDto)
     const user = this.request.user
  const [followings,count] = await this.FollowRepo.findAndCount({
    where : {follower_id:user!.id},
    relations:{
      following :{
        profile:true
      }
    },
    select:{
      id:true,
      following:{
        id:true,
        username:true,
        profile:{
          id:true,
          nick_name:true,
          bio:true,
          image_bg:true,
          image_profile:true
        }
      }
    },
    skip,
    take:limit
  })
  return {
    followings
  }
 }
 
}
