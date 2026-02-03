import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { Json, urlEncoded } from 'src/common/constants/constants';

@Controller('auth')
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user-existance')
  @ApiConsumes(urlEncoded , Json)
  userExistance(@Body() authDto:AuthDto){
    return this.authService.userExistance(authDto)
  }
}
 