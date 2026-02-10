import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { MultipartData } from 'src/common/constants/constants';

@Controller('user')
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put()
  @ApiConsumes(MultipartData)
  changeProfile(@Body() profileDto:ProfileDto){
    return this.userService.changeProfile(profileDto)
  }
}
