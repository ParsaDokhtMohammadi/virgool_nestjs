import { Controller, Get, Post, Body, Put, ParseFilePipe, UseGuards, UploadedFiles, Res, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { Json, MultipartData, urlEncoded } from 'src/common/constants/constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileFileUploader } from 'src/common/decorators/uploaderProfile.decorator';
import type{ ProfileImages } from './types/files.type';
import { changeEmailDto, changeUsernameDto } from './dto/changeCredentials.dto';
import type{ Response } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';

@Controller('user')
@ApiTags("user")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put()
  @ApiConsumes(MultipartData)
  @ProfileFileUploader()
  changeProfile(
    @UploadedFiles(new ParseFilePipe({
      fileIsRequired:false
      ,validators:[]
    })) files:ProfileImages,
    @Body() profileDto:ProfileDto
  ){
    return this.userService.changeProfile(files,profileDto)
  }
  @Get()
  getProfile(){
    return this.userService.getProfile()
  }
  @Patch("/change-email")
  @ApiConsumes(urlEncoded,Json)
  async changeEmail(@Body() dto:changeEmailDto , @Res({ passthrough: true }) res: Response){
    const result = await this.userService.changeEmail(dto)
    if(result.token){
      res.cookie(COOKIE_KEYS.OTP,result.token,{httpOnly:true,maxAge:1000*60*2})
    }
    return result
    
  }
  @Patch("/change-username")
  @ApiConsumes(urlEncoded,Json)
  changeUsername(@Body() dto:changeUsernameDto , @Res({ passthrough: true }) res: Response){
    return this.userService.changeUsername(dto)
  }
  @Get("/follow/:following_id")
  @ApiParam({name:"following_id"})
  follow(@Param("following_id",ParseIntPipe) following_id:number){
    return this.userService.followToggle(following_id)
  }
}

