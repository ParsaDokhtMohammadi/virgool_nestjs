import { Request } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface AuthRequest extends Request {
  user?: UserEntity;
}