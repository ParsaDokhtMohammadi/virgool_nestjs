import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsString, Length } from "class-validator"
import { AuthMethod } from "src/common/enums/method.enum"
import { AuthTypes } from "src/common/enums/type.enum"

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(5,50)
    username:string
    @ApiProperty({enum:AuthTypes})
    @IsEnum(AuthTypes)
    type:string
    @ApiProperty({enum:AuthMethod})
    @IsEnum(AuthMethod)
    method:AuthMethod
}

export class CheckOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5,5)
    code:string
}