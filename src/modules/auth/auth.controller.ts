import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { Json, urlEncoded } from 'src/common/constants/constants';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';


@Controller('auth')
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user-existance')
  @ApiConsumes(urlEncoded , Json)
   userExistance(@Body() authDto:AuthDto,@Res() res:Response){
    return this.authService.userExistance(authDto , res)

  }
  @Post('check-otp')
  @ApiConsumes(urlEncoded , Json)
  checkOtp(@Body() OtpDto:CheckOtpDto){
    return this.authService.checkOtp(OtpDto.code)
    
  }
  @Get('check-login')
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  checkLogin(@Req() req:Request){
    return req.user
  }

}
 