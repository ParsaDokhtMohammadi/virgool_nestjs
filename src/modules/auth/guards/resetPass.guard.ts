import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { COOKIE_KEYS } from 'src/common/enums/cookie.enum';
import { RESET_PASS_MESSAGE } from 'src/common/enums/message.enum';
import { TokenService } from '../Token.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);

    const payload = this.tokenService.verifyForgotPassToken(token);

    request.user = payload

    return true;
  }

  protected extractToken(request: Request): string {
    const token = request.cookies?.[COOKIE_KEYS.FORGOT_PASS];

    if (!token) {
      throw new UnauthorizedException(RESET_PASS_MESSAGE.NO_COOKIE);
    }

    return token;
  }
}