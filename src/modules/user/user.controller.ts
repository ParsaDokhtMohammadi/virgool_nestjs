import { Controller, Get, Post, Body, Put, ParseFilePipe, UseGuards, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { MultipartData } from 'src/common/constants/constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileFileUploader } from 'src/common/decorators/uploader.decorator';

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
      })) files:any,
    @Body() profileDto:ProfileDto
  ){
    return this.userService.changeProfile(files,profileDto)
  }
}
