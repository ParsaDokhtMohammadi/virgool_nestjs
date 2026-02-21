import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CanAccess } from "src/common/decorators/role.decorator";
import { ROLES } from "src/common/enums/role.enum";
import { AuthRequest } from "src/common/types/authRequest.type";

@Injectable()
export class RoleGaurd implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(CanAccess, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request: AuthRequest = context.switchToHttp().getRequest<AuthRequest>();
        const user = request.user; // user object
        const userRole = user?.role ?? ROLES.USER;

        if (user?.role === ROLES.ADMIN) return true;
        if (requiredRoles.includes(userRole as ROLES)) return true;

        throw new ForbiddenException();
    }
}