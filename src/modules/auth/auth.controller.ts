import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { Json, urlEncoded } from 'src/common/constants/constants';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';
import {AUTH_RESULTS_ENUM} from 'src/common/enums/type.enum';
import { json } from 'stream/consumers';


@Controller('auth')
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user-existance')
  @ApiConsumes(urlEncoded , Json)
   async userExistance(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.userExistance(authDto);    

    if (result.token) {
      const cookieOptions = {
        httpOnly: true,
      };

 
      if (result.type === AUTH_RESULTS_ENUM.REGISTER) {
        // OTP token: short expiry
        res.cookie(COOKIE_KEYS.OTP, result.token, { ...cookieOptions, maxAge: 1000 * 60 * 2 });
      } else if (result.type === AUTH_RESULTS_ENUM.LOGIN) {
        // Access token: longer expiry (e.g., 1 year)
        res.cookie(COOKIE_KEYS.ACCESS, result.token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365 });
      }
    }
    return result
  }
  @Post('check-otp')
  @ApiConsumes(urlEncoded , Json)
  async checkOtp(@Body() OtpDto:CheckOtpDto , @Res({ passthrough: true }) res: Response){

     const result = await this.authService.checkOtp(OtpDto.code)
     if(result.token){
      res.cookie(COOKIE_KEYS.FORGOT_PASS,result.token,{httpOnly:true , maxAge:1000*60*10})

     }
       return result
     
    
  }
  @Get('check-login')
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  checkLogin(@Req() req:Request){
    return req.user
  }
  @Post('forgot-password')
  @ApiConsumes(urlEncoded,Json)
  async forgotPassword(@Body() email:ForgotPasswordDto , @Res({ passthrough: true }) res: Response){
    const result = await this.authService.forgotPassword(email)
    res.cookie(COOKIE_KEYS.OTP,result.token,{httpOnly:true,maxAge:1000*60*2})
    return result.code
  }
  @Post('reset-password')
  @ApiConsumes(urlEncoded,Json)
  async resetPassword(@Body() Dto:ResetPasswordDto){
    return this.authService.resetPassword(Dto)
  }

}
 