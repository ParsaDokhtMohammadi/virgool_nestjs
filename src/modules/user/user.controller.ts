import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';

@Controller('user')
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put()
  changeProfile(@Body() profileDto:ProfileDto){
    return this.userService.changeProfile(profileDto)
  }
}
