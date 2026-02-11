import { Controller, Get, Post, Body, Put, ParseFilePipe, UseGuards, UploadedFiles, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { Json, MultipartData, urlEncoded } from 'src/common/constants/constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileFileUploader } from 'src/common/decorators/uploaderProfile.decorator';
import type{ ProfileImages } from './types/files.type';
import { changeEmailDto } from './dto/changeEmail.dto';
import type{ Response } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';

@Controller('user')
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put()
  @ApiConsumes(MultipartData)
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
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
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  getProfile(){
    return this.userService.getProfile()
  }
  @Post("/change-email")
  @ApiBearerAuth("Authorization")
  @ApiConsumes(Json,urlEncoded)
  @UseGuards(AuthGuard)
  async changeEmail(@Body() dto:changeEmailDto , @Res({ passthrough: true }) res: Response){
    const result = await this.userService.changeEmail(dto)
    if(result.token){
      res.cookie(COOKIE_KEYS.OTP,result.token,{httpOnly:true,maxAge:1000*60*2})
    }
    return result
    
  }
}
