import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { Json, urlEncoded } from 'src/common/constants/constants';
import type { Response } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';


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

}
 