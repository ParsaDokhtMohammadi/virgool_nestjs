import { SetMetadata } from "@nestjs/common"
import { ROLES } from "../enums/role.enum"

export const ROLE_KEY = "ROLES"

export const CanAccess = (...roles:ROLES[]) => SetMetadata(ROLE_KEY,roles)
